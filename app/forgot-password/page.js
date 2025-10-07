"use client";
import { useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("request"); // request | reset
  const [identifier, setIdentifier] = useState("");
  const [token, setToken] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
      setMessage(`A reset code has been sent to your email${identifier ? ` (for ${identifier})` : ''}.`);
      setStep("reset");
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const reset = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[60vh] mt-32 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border rounded-lg shadow p-6">
        <h1 className="text-xl font-bold mb-4">Forgot password</h1>
        {message && <div className="mb-3 text-green-600 text-sm">{message}</div>}
        {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}

        {step === "request" ? (
          <form className="space-y-4" onSubmit={request}>
            <div>
              <label className="block text-sm font-medium mb-1">Email or Username</label>
              <input className="w-full border rounded px-3 py-2" value={identifier} onChange={(e)=>setIdentifier(e.target.value)} placeholder="you@example.com or username" />
            </div>
            <button disabled={loading} className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded">{loading? 'Please wait...' : 'Send reset link'}</button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={reset}>
            <div>
              <label className="block text-sm font-medium mb-1">Verification code</label>
              <input className="w-full border rounded px-3 py-2" value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Enter 6-digit code" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New password</label>
              <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="******" />
            </div>
            <button disabled={loading} className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded">{loading? 'Please wait...' : 'Reset password'}</button>
          </form>
        )}
      </div>
    </div>
  );
}


