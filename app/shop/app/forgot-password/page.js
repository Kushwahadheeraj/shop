"use client";
import { useState, useRef } from "react";
import API_BASE_URL from "@/lib/apiConfig";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("request"); // request | reset
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  const request = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setError("");
      const res = await fetch(`${API_BASE_URL}/euser/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername: identifier })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed');
      setMessage(data.message || `A reset code has been sent.`);
      setStep("reset");
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const reset = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }
    try {
      setLoading(true); setError("");
      const res = await fetch(`${API_BASE_URL}/euser/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername: identifier, code, newPassword: password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed');
      setMessage('Password reset successful. You can now log in.');
      // Optional: Redirect or reset state
      setTimeout(() => {
        // window.location.href = '/login'; // or router.push
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    
    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pastedData.every(char => !isNaN(char))) {
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  return (
    <div className="min-h-[60vh] mt-32 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">Forgot password</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          {step === "request" 
            ? "Enter your details to receive a reset code" 
            : "Enter the 6-digit code sent to you"}
        </p>

        {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded text-sm text-center">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm text-center">{error}</div>}

        {step === "request" ? (
          <form className="space-y-6" onSubmit={request}>
            <div>
              <label className="block text-sm font-semibold mb-2">Email, Username or Mobile Number</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 outline-none transition-all" 
                value={identifier} 
                onChange={(e)=>setIdentifier(e.target.value)} 
                placeholder="Enter email, username or mobile" 
                required
              />
            </div>
            <button 
              disabled={loading} 
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={reset}>
            <div>
              <label className="block text-sm font-semibold mb-3 text-center">Verification Code</label>
              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-bold focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">New Password</label>
              <input 
                type="password" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 outline-none" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                placeholder="Enter new password" 
                required
                minLength={6}
              />
            </div>
            
            <button 
              disabled={loading} 
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            
            <button 
              type="button"
              onClick={() => { setStep("request"); setMessage(""); setError(""); setOtp(["","","","","",""]); }}
              className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Back to Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
