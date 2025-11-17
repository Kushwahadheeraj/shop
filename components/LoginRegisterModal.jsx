"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import API_BASE_URL from "@/lib/apiConfig";

const SELLER_LINK_ACCESS_KEY = "sellerLinkUnlocked";

export default function LoginRegisterModal({ open, onClose }) {
  const [login, setLogin] = useState({ username: "", password: "", remember: false });
  const [register, setRegister] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSellerLink, setShowSellerLink] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    if (typeof window === "undefined") return;

    const alreadyUnlocked = sessionStorage.getItem(SELLER_LINK_ACCESS_KEY);
    if (alreadyUnlocked === "true") {
      setShowSellerLink(true);
    }

    const handleSecretCombo = (event) => {
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        sessionStorage.setItem(SELLER_LINK_ACCESS_KEY, "true");
        setShowSellerLink(true);
      }
    };

    window.addEventListener("keydown", handleSecretCombo);
    return () => window.removeEventListener("keydown", handleSecretCombo);
  }, [open]);

  if (!open) return null;

  const finish = () => {
    onClose?.();
    router.push("/");
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('euser-auth'));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setError("");
      const res = await fetch(`${API_BASE_URL}/euser/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: login.username, password: login.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Login failed');
      localStorage.setItem('euser_token', data.token);
      if (data?.user) localStorage.setItem('euser', JSON.stringify(data.user));
      if (data?.user?.username) localStorage.setItem('euser_username', data.user.username);
      finish();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setError("");
      const res = await fetch(`${API_BASE_URL}/euser/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(register)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Registration failed');
      localStorage.setItem('euser_token', data.token);
      if (data?.user) localStorage.setItem('euser', JSON.stringify(data.user));
      if (data?.user?.username) localStorage.setItem('euser_username', data.user.username);
      finish();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10" onClick={() => onClose?.()}>
      <div className="bg-white rounded-lg md:rounded-xl shadow-2xl ring-1 ring-black/10 w-[92vw] max-w-[920px] mx-2 md:mx-4 relative flex flex-col md:flex-row max-h-[90vh] overflow-y-auto overflow-x-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-black"
          onClick={() => onClose?.()}
        >
          &times;
        </button>
        {/* Login */}
        <div className="w-full md:w-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-200">
          <h2 className="text-2xl font-extrabold mb-6">LOGIN</h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block font-bold mb-1">Username or email address *</label>
              <Input
                value={login.username}
                onChange={e => setLogin({ ...login, username: e.target.value })}
                className="bg-blue-50"
                placeholder=""
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Password *</label>
              <Input
                type="password"
                value={login.password}
                onChange={e => setLogin({ ...login, password: e.target.value })}
                className="bg-blue-50"
                placeholder=""
              />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={login.remember}
                onChange={e => setLogin({ ...login, remember: e.target.checked })}
                id="remember"
              />
              <label htmlFor="remember" className="text-sm">Remember me</label>
            </div>
            <Button disabled={loading} className="bg-yellow-300 hover:bg-yellow-300 text-white font-bold text-lg py-2">{loading ? 'Please wait...' : 'LOG IN'}</Button>
            <Link href="/forgot-password" className="text-xs text-gray-600 hover:underline block mt-2">Lost your password?</Link>
          </form>
        </div>
        {/* Center OR Badge (desktop) */}
        <div
          aria-hidden="true"
          className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow text-gray-600 text-xs font-bold select-none"
        >
          OR
        </div>
        {/* Register */}
        <div className="w-full md:w-1/2 p-6 md:p-8">
          <h2 className="text-2xl font-extrabold mb-6">REGISTER</h2>
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block font-bold mb-1">Username *</label>
              <Input
                value={register.username}
                onChange={e => setRegister({ ...register, username: e.target.value })}
                placeholder=""
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Email address *</label>
              <Input
                type="email"
                value={register.email}
                onChange={e => setRegister({ ...register, email: e.target.value })}
                placeholder=""
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Password *</label>
              <Input
                type="password"
                value={register.password}
                onChange={e => setRegister({ ...register, password: e.target.value })}
                placeholder=""
              />
            </div>
            
            {/* <p
              className="flex flex-col text-justify text-xs text-gray-500 leading-snug w-32 mb-3 "
            >
              Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <Link href="/privacy-policy" className="underline">privacy policy</Link>
            </p> */}
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button disabled={loading} className="bg-yellow-300 hover:bg-yellow-300 text-white font-bold text-sm md:text-base py-2 px-5 w-auto self-start">{loading ? 'Please wait...' : 'REGISTER'}</Button>
          </form>
        </div>
        {/* Seller Login Redirect - hidden behind secret combo */}
        {showSellerLink && (
          <div className="absolute bottom-2 right-2 w-full flex justify-end">
            <Link href="/login/seller" className="text-xs text-blue-600 hover:underline font-semibold">
              Seller Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
