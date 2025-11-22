/**
 * Central place to resolve the backend API base URL.
 * Falls back to the local Express server so the storefront
 * does not attempt to call the Next.js App Router.
 */
const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.API_BASE_URL ||
  process.env.BACKEND_API_URL ||
  "https://shop-backend-qf50.onrender.com/api";

const API_BASE_URL = apiBase.replace(/\/+$/, "");

export default API_BASE_URL;

