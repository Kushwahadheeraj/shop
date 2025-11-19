"use client";
import { CartProvider } from './CartContext';

export default function ClientCartProvider({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
