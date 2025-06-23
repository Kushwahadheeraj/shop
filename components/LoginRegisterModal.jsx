"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginRegisterModal({ open, onClose }) {
  const [login, setLogin] = useState({ username: "", password: "", remember: false });
  const [register, setRegister] = useState({ username: "", email: "", password: "" });
  const router = useRouter();

  if (!open) return null;

  const handleClose = () => {
    onClose();
    router.push("/");
  };

  // Simulate login/register and redirect
  const handleLogin = (e) => {
    e.preventDefault();
    handleClose();
  };
  const handleRegister = (e) => {
    e.preventDefault();
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg w-full max-w-4xl mx-4 relative flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-black"
          onClick={handleClose}
        >
          &times;
        </button>
        {/* Login */}
        <div className="w-full md:w-1/2 p-8 border-r border-gray-200">
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
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={login.remember}
                onChange={e => setLogin({ ...login, remember: e.target.checked })}
                id="remember"
              />
              <label htmlFor="remember" className="text-sm">Remember me</label>
            </div>
            <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-lg py-2">LOG IN</Button>
            <Link href="/forgot-password" className="text-xs text-gray-600 hover:underline block mt-2">Lost your password?</Link>
          </form>
        </div>
        {/* Register */}
        <div className="w-full md:w-1/2 p-8">
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
            <p className="text-xs text-gray-500">
              Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <Link href="/privacy-policy" className="underline">privacy policy</Link>.
            </p>
            <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-lg py-2">REGISTER</Button>
          </form>
        </div>
        {/* Seller Login Redirect */}
        <div className="absolute bottom-2 right-2 w-full flex justify-end">
          <Link href="/login/seller" className="text-xs text-blue-600 hover:underline font-semibold">
            Seller Login
          </Link>
        </div>
      </div>
    </div>
  );
}
