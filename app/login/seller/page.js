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
    // If no secret enforced, allow access
    if (!SECRET_KEY) {
      setHasPortalAccess(true);
      setAccessChecked(true);
      return;
    }

    // Already unlocked in session
    if (typeof window !== "undefined") {
      const unlocked = sessionStorage.getItem(ACCESS_STORAGE_KEY);
      if (unlocked === "true") {
        setHasPortalAccess(true);
        setAccessChecked(true);
        return;
      }
    }

    // Check URL token
    if (secretFromUrl && secretFromUrl === SECRET_KEY) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(ACCESS_STORAGE_KEY, "true");
      }
      setHasPortalAccess(true);
    }
    setAccessChecked(true);
  }, [secretFromUrl]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated()) {
      router.push("/Dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  // Password strength validation
  const isPasswordStrong = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  // Mobile number validation
  const isValidMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // GST number validation
  const isValidGST = (gst) => {
    // GST format: 2 digits state code + 10 digits PAN + 1 digit entity + 1 digit check sum
    // Example: 27AAPFU0939F1Z5
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst.toUpperCase());
  };

  // Check if form is valid for registration
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
          router.push("/Dashboard");
        } else {
          throw new Error(result.error || "Invalid credentials");
        }
      } else {
        // Remove confirmPassword before sending to API
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

  // Show loading while checking authentication or secret access
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
            <>
              {/* Username */}
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username *"
                  value={form.username}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${
                    form.username && form.username.trim() === "" ? "border-red-500" : ""
                  }`}
                  required
                />
                {form.username && form.username.trim() === "" && (
                  <p className="text-red-500 text-xs mt-1">Username is required</p>
                )}
              </div>

                             {/* Mobile Number */}
               <div>
                 <input
                   type="tel"
                   name="mobile"
                   placeholder="Mobile Number (10 digits) *"
                   value={form.mobile}
                   onChange={handleChange}
                   className={`w-full border rounded px-3 py-2 ${
                     form.mobile && !isValidMobile(form.mobile) ? "border-red-500" : ""
                   }`}
                   required
                 />
                 {form.mobile && !isValidMobile(form.mobile) && (
                   <p className="text-red-500 text-xs mt-1">Please enter a valid 10-digit mobile number</p>
                 )}
               </div>

               {/* Shop Name */}
               <div>
                 <input
                   type="text"
                   name="shopName"
                   placeholder="Shop Name *"
                   value={form.shopName}
                   onChange={handleChange}
                   className={`w-full border rounded px-3 py-2 ${
                     form.shopName && form.shopName.trim() === "" ? "border-red-500" : ""
                   }`}
                   required
                 />
                 {form.shopName && form.shopName.trim() === "" && (
                   <p className="text-red-500 text-xs mt-1">Shop name is required</p>
                 )}
               </div>

               {/* GST Number */}
               <div>
                 <input
                   type="text"
                   name="gstNumber"
                   placeholder="GST Number (e.g., 27AAPFU0939F1Z5) *"
                   value={form.gstNumber}
                   onChange={handleChange}
                   className={`w-full border rounded px-3 py-2 ${
                     form.gstNumber && !isValidGST(form.gstNumber) ? "border-red-500" : ""
                   }`}
                   required
                 />
                 {form.gstNumber && !isValidGST(form.gstNumber) && (
                   <p className="text-red-500 text-xs mt-1">Please enter a valid GST number (15 characters)</p>
                 )}
               </div>
            </>
          )}

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={form.email}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 ${
                form.email && !isValidEmail(form.email) ? "border-red-500" : ""
              }`}
              required
            />
            {form.email && !isValidEmail(form.email) && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password *"
              value={form.password}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 pr-10 ${
                form.password && !isPasswordStrong(form.password) ? "border-red-500" : ""
              }`}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
            {form.password && !isPasswordStrong(form.password) && (
              <div className="text-red-500 text-xs mt-1">
                Password must contain: 8+ characters, uppercase, lowercase, number, special character
              </div>
            )}
          </div>

          {/* Confirm Password */}
          {mode === "register" && (
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password *"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 pr-10 ${
                  form.confirmPassword && form.password !== form.confirmPassword ? "border-red-500" : ""
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>
          )}

          {/* Privacy Policy */}
          {mode === "register" && (
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="privacy"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="privacy" className="text-xs text-gray-600">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => {
                    alert(`E-COMMERCE PRIVACY POLICY

1. INFORMATION COLLECTION
We collect personal information including name, email, mobile number, and address for account creation and order processing.

2. DATA USAGE
Your data is used for:
- Account management and authentication
- Order processing and delivery
- Customer support and communication
- Marketing communications (with consent)

3. DATA PROTECTION
We implement security measures to protect your personal information from unauthorized access, alteration, or disclosure.

4. DATA SHARING
We do not sell your personal information. Data may be shared with:
- Payment processors for transactions
- Delivery partners for order fulfillment
- Legal authorities when required by law

5. YOUR RIGHTS
You have the right to:
- Access your personal data
- Update or correct your information
- Request data deletion
- Opt-out of marketing communications

6. COOKIES
We use cookies to enhance your shopping experience and analyze website usage.

7. CONTACT
For privacy concerns, contact us at privacy@example.com

By registering, you agree to this privacy policy.`);
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Privacy Policy
                </button>
              </label>
            </div>
          )}

          <button
            type="submit"
            className={`w-full font-bold py-2 rounded transition-colors ${
              mode === "register" && !isFormValid()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-300 hover:bg-yellow-300 text-white"
            }`}
            disabled={loading || (mode === "register" && !isFormValid())}
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

export default function SellerLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]"><div className="text-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-600">Loading...</p></div></div>}>
      <SellerLoginPageContent />
    </Suspense>
  );
}