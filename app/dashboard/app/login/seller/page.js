"use client";
import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import API_BASE_URL from "@/lib/apiConfig";
import { useAuth } from "@/components/AuthContext";
import BrandLogo from "@/components/BrandLogo";

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
        // Login function now handles redirect automatically with window.location
        const result = await login(form.email, form.password, "/");
        if (result.success) {
          setSuccess("Login successful! Redirecting...");
          // Redirect is handled in login function via window.location.href
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-md lg:max-w-6xl w-full lg:h-[90vh] grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="hidden lg:flex bg-gradient-to-br from-black via-gray-900 to-black text-white rounded-3xl p-8 flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute w-48 h-48 bg-yellow-300 rounded-full -top-10 -left-10 blur-3xl"></div>
            <div className="absolute w-48 h-48 bg-yellow-300 rounded-full bottom-10 right-0 blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <BrandLogo inheritColor />
              {/* <div className="w-12 h-12 rounded-2xl bg-yellow-300 shadow-lg shadow-yellow-300/50" /> */}
              <div>
                {/* <p className="text-xs uppercase tracking-widest text-gray-400 font-medium"> */}
                  {/* Hadware Sink */}
                {/* </p> */}
                <h1 className="text-2xl font-bold">Seller Portal</h1>
              </div>
            </div>

            <h2 className="text-3xl font-bold leading-tight mb-3">
              Manage your store with confidence.
            </h2>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Secure login, detailed insights, and complete control over your business operations.
            </p>

            <div className="space-y-4">
              {[
                { title: "2-Factor Authentication", desc: "Secure access with OTP verification." },
                { title: "1-Click Reorder", desc: "Quickly reorder popular inventory." },
                { title: "Smart Analytics", desc: "Understand trends. Boost performance." },
              ].map((item, index) => (
                <div key={index} className="flex gap-3 items-start group">
                  <span className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:bg-white/20 transition-all">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm mb-0.5">{item.title}</h3>
                    <p className="text-gray-400 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-400">Need help? Contact support@hadwaresink.com</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-gray-200 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4 lg:hidden">
            <BrandLogo />
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">Seller Portal</p>
              <p className="text-xs text-gray-400">Secure login for store management</p>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-1">Welcome back</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {mode === "login" ? "Seller Login" : "Register Seller"}
              </h3>
            </div>
            <div className="flex bg-gray-100 rounded-full p-1 shadow-inner">
              <button
                className={`text-xs px-3 sm:px-4 py-2 rounded-full transition-all font-medium ${
                  mode === "login" 
                    ? "bg-black text-white shadow-md" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => router.push("/login/seller?mode=login")}
              >
                Login
              </button>
              <button
                className={`text-xs px-3 sm:px-4 py-2 rounded-full transition-all font-medium ${
                  mode === "register" 
                    ? "bg-black text-white shadow-md" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => router.push("/login/seller?mode=register")}
              >
                Register
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg p-3 mb-4 text-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg p-3 mb-4 text-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
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
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-black focus:border-black transition-all outline-none"
                    />
                  </div>
                ))}
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seller@email.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-black focus:border-black transition-all outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-16 text-sm bg-white focus:ring-2 focus:ring-black focus:border-black transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {mode === "register" && (
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters and include uppercase, lowercase, number and special character.
                </p>
              )}
            </div>

            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-16 text-sm bg-white focus:ring-2 focus:ring-black focus:border-black transition-all outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-3 text-sm text-gray-500 hover:text-gray-700 font-medium"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            )}

            {mode === "register" && (
              <label className="flex items-start gap-2.5 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-black focus:ring-black"
                />
                <span>
                  I agree to the <a className="underline hover:text-gray-900" href="#">Privacy policy</a> and
                  <a className="underline hover:text-gray-900" href="#"> Terms of service</a>.
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black text-white py-3 text-sm font-semibold hover:bg-gray-900 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl mt-4"
            >
              {loading ? "Processing..." : mode === "login" ? "Sign in" : "Register"}
            </button>

            {mode === "login" && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Forgot password? <a className="underline hover:text-gray-700 font-medium" href="#">Reset here</a>
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

