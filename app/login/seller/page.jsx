"use client";
import { SignIn, SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SellerLoginPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-8">
        {mode === "register" ? (
          <>
            <h2 className="text-2xl font-extrabold mb-6 text-center">SELLER REGISTER</h2>
            <SignUp
              path="/login/seller"
              routing="path"
              afterSignUpUrl="/dashboard"
              afterSignInUrl="/dashboard"
              appearance={{
                elements: {
                  formButtonPrimary: "bg-yellow-400 hover:bg-yellow-500 text-white font-bold",
                },
              }}
              signInUrl="/login/seller?mode=login"
            />
            <div className="text-center mt-4">
              Already have an account?{' '}
              <a href="/login/seller?mode=login" className="text-blue-600 hover:underline font-semibold">
                Seller Login
              </a>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold mb-6 text-center">SELLER LOGIN</h2>
            <SignIn
              path="/login/seller"
              routing="path"
              afterSignInUrl="/dashboard"
              appearance={{
                elements: {
                  formButtonPrimary: "bg-yellow-400 hover:bg-yellow-500 text-white font-bold",
                },
              }}
              signUpUrl="/login/seller?mode=register"
            />
            <div className="text-center mt-4">
              New seller?{' '}
              <a href="/login/seller?mode=register" className="text-blue-600 hover:underline font-semibold">
                Register
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 