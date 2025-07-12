"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SellerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(
        mode === "register"
          ? "http://localhost:3001/api/seller/register"
          : "http://localhost:3001/api/seller/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            mode === "register"
              ? form
              : { email: form.email, password: form.password }
          ),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      if (mode === "login") {
        localStorage.setItem("token", data.token);
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => router.push("/Dashboard"), 1000);
      } else {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => router.push("/login/seller?mode=login"), 1000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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