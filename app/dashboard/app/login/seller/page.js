"use client";
import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import API_BASE_URL from "@/lib/apiConfig";
import { useAuth } from "@/components/AuthContext";

const SECRET_PARAM = "access";
const ACCESS_STORAGE_KEY = "seller_portal_access";
const SECRET_KEY = process.env.NEXT_PUBLIC_SELLER_LOGIN_KEY;

function SellerLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    mobile: "",
    shopName: "",
    gstNumber: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasPortalAccess, setHasPortalAccess] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const secretFromUrl = useMemo(
    () => searchParams.get(SECRET_PARAM),
    [searchParams]
  );

  useEffect(() => {
    if (!SECRET_KEY) {
      setHasPortalAccess(true);
      setAccessChecked(true);
      return;
    }

    if (typeof window !== "undefined") {
      const unlocked = sessionStorage.getItem(ACCESS_STORAGE_KEY);
      if (unlocked === "true") {
        setHasPortalAccess(true);
        setAccessChecked(true);
        return;
      }
    }

    if (secretFromUrl && secretFromUrl === SECRET_KEY) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(ACCESS_STORAGE_KEY, "true");
      }
      setHasPortalAccess(true);
    }
    setAccessChecked(true);
  }, [secretFromUrl]);

  useEffect(() => {
    if (!authLoading && isAuthenticated()) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  const isPasswordStrong = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const isValidMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidGST = (gst) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst.toUpperCase());
  };

  const isFormValid = () => {
    if (mode !== "register") return true;

    return (
      form.username.trim() !== "" &&
      form.email.trim() !== "" &&
      form.mobile.trim() !== "" &&
      form.shopName.trim() !== "" &&
      form.gstNumber.trim() !== "" &&
      form.password.trim() !== "" &&
      form.confirmPassword.trim() !== "" &&
      isValidEmail(form.email) &&
      isValidMobile(form.mobile) &&
      isValidGST(form.gstNumber) &&
      isPasswordStrong(form.password) &&
      form.password === form.confirmPassword &&
      privacyAccepted
    );
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "register" && !isFormValid()) {
      setError("Please fill all fields correctly and accept privacy policy");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (mode === "login") {
        const result = await login(form.email, form.password);
        if (result.success) {
          setSuccess("Login successful! Redirecting...");
          router.push("/");
        } else {
          throw new Error(result.error || "Invalid credentials");
        }
      } else {
        const { confirmPassword, ...registrationData } = form;
        const res = await fetch(`${API_BASE_URL}/seller/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registrationData),
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

  if (authLoading || !accessChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasPortalAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
        <div className="bg-white rounded shadow-lg w-full max-w-md p-8 text-center space-y-2">
          <p className="text-lg font-semibold text-gray-800">Portal locked</p>
          <p className="text-sm text-gray-500">
            Access link invalid. Contact your account manager for the latest seller portal URL.
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-12 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-black to-gray-900 text-white rounded-3xl p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute w-60 h-60 bg-white rounded-full -top-10 -left-10 blur-3xl"></div>
            <div className="absolute w-60 h-60 bg-white rounded-full bottom-10 right-0 blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-yellow-300" />
              <div>
                <p className="text-sm uppercase tracking-widest text-gray-300">
                  Hadware Sink
                </p>
                <h1 className="text-2xl font-bold">Seller Portal</h1>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-4">
              Manage your store with confidence.
            </h2>
            <p className="text-gray-300 text-lg mb-10">
              Secure login, detailed insights, and complete control over your
              business operations.
            </p>

            <div className="space-y-6">
              {[
                { title: "2-Factor Authentication", desc: "Secure access with OTP verification." },
                { title: "1-Click Reorder", desc: "Quickly reorder popular inventory." },
                { title: "Smart Analytics", desc: "Understand trends. Boost performance." },
              ].map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <span className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-300 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-sm text-gray-400">Need help? Contact support@hadwaresink.com</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-widest">Welcome back</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {mode === "login" ? "Seller Login" : "Register Seller"}
              </h3>
            </div>
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                className={`text-sm px-4 py-2 rounded-full transition ${
                  mode === "login" ? "bg-black text-white" : "text-gray-500"
                }`}
                onClick={() => router.push("/login/seller?mode=login")}
              >
                Login
              </button>
              <button
                className={`text-sm px-4 py-2 rounded-full transition ${
                  mode === "register" ? "bg-black text-white" : "text-gray-500"
                }`}
                onClick={() => router.push("/login/seller?mode=register")}
              >
                Register
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-100 text-green-600 rounded-2xl p-4 mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                {[
                  { label: "Full Name", name: "username", type: "text" },
                  { label: "Mobile Number", name: "mobile", type: "tel" },
                  { label: "Shop Name", name: "shopName", type: "text" },
                  { label: "GST Number", name: "gstNumber", type: "text", placeholder: "Example: 27AAPFU0939F1Z5" },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                    />
                  </div>
                ))}
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seller@email.com"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 text-sm text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {mode === "register" && (
                <p className="text-xs text-gray-500">
                  Must be at least 8 characters and include uppercase, lowercase, number and special character.
                </p>
              )}
            </div>

            {mode === "register" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-3 text-sm text-gray-500"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            )}

            {mode === "register" && (
              <label className="flex items-start gap-3 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-black focus:ring-black"
                />
                <span>
                  I agree to the <a className="underline" href="#">Privacy policy</a> and
                  <a className="underline" href="#"> Terms of service</a>.
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-black text-white py-3 font-semibold hover:bg-gray-900 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : mode === "login" ? "Sign in" : "Register"}
            </button>

            {mode === "login" && (
              <p className="text-center text-sm text-gray-500">
                Forgot password? <a className="underline" href="#">Reset here</a>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SellerLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SellerLoginPageContent />
    </Suspense>
  );
}

