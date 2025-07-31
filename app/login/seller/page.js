"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import API_BASE_URL from "@/lib/apiConfig";
import { useAuth } from "@/components/AuthContext";

export default function SellerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated()) {
      router.push("/Dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (mode === "login") {
        const result = await login(form.email, form.password);
        if (result.success) {
          setSuccess("Login successful! Redirecting...");
          router.push("/Dashboard");
        } else {
          throw new Error(result.error || "Invalid credentials");
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/seller/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Something went wrong");
        setSuccess("Registration successful! Redirecting to login...");
        router.push("/login/seller?mode=login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show login page if already authenticated
  if (isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-extrabold mb-6 text-center">
          {mode === "register" ? "SELLER REGISTER" : "SELLER LOGIN"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 rounded"
            disabled={loading}
          >
            {loading ? "Please wait..." : mode === "register" ? "Register" : "Login"}
          </button>
        </form>
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
        {success && <div className="text-green-600 mt-4 text-center">{success}</div>}
        <div className="text-center mt-4">
          {mode === "register" ? (
            <>
              Already have an account?{' '}
              <a href="/login/seller?mode=login" className="text-blue-600 hover:underline font-semibold">
                Seller Login
              </a>
            </>
          ) : (
            <>
              New seller?{' '}
              <a href="/login/seller?mode=register" className="text-blue-600 hover:underline font-semibold">
                Register
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 