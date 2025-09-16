"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

function safeParse(json, fallback) {
	try { return JSON.parse(json); } catch { return fallback; }
}

function getStorageKey(user) {
	return user?.id ? `cart_user_${user.id}` : 'cart_guest';
}

export function CartProvider({ children }) {
	const { user } = useAuth();
	const [items, setItems] = useState([]);
	const [isReady, setIsReady] = useState(false);

	// Load cart from localStorage on mount and whenever user changes
	useEffect(() => {
		const key = getStorageKey(user);
		const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
		const loaded = raw ? safeParse(raw, []) : [];
		setItems(Array.isArray(loaded) ? loaded : []);
		setIsReady(true);
	}, [user]);

	// Persist
	useEffect(() => {
		if (!isReady) return;
		const key = getStorageKey(user);
		localStorage.setItem(key, JSON.stringify(items));
	}, [items, user, isReady]);

	// Merge guest cart into user cart right after login
	useEffect(() => {
		if (!user) return; // only when logged in
		const guestRaw = localStorage.getItem('cart_guest');
		if (!guestRaw) return;
		const guest = safeParse(guestRaw, []);
		if (!Array.isArray(guest) || guest.length === 0) return;
		setItems((prev) => mergeItems(prev, guest));
		localStorage.removeItem('cart_guest');
	}, [user]);

	const count = useMemo(() => items.reduce((sum, it) => sum + (it.quantity || 1), 0), [items]);
	const total = useMemo(() => items.reduce((sum, it) => sum + (Number(it.price || 0) * (it.quantity || 1)), 0), [items]);

	function mergeItems(primary, incoming) {
		const idKey = (p) => p._id || p.id;
		const map = new Map();
		[...primary, ...incoming].forEach((p) => {
			const key = idKey(p);
			if (!key) return;
			const existing = map.get(key);
			if (existing) {
				map.set(key, { ...existing, quantity: Math.max(1, (existing.quantity || 1) + (p.quantity || 1)) });
			} else {
				map.set(key, { ...p, quantity: Math.max(1, p.quantity || 1) });
			}
		});
		return Array.from(map.values());
	}

	function addItem(product, qty = 1) {
		if (!product) return;
		const toStore = {
			_id: product._id || product.id,
			name: product.name || product.title || 'Product',
			price: Number(product.price || product.salePrice || 0),
			mrp: Number(product.mrp || product.originalPrice || product.price || 0),
			thumbnail: resolveImage(product),
			quantity: qty,
		};
		setItems((prev) => mergeItems(prev, [toStore]));
	}

	function updateQuantity(id, qty) {
		setItems((prev) => prev.map((p) => (p._id === id ? { ...p, quantity: Math.max(1, qty) } : p)));
	}

	function removeItem(id) {
		setItems((prev) => prev.filter((p) => (p._id || p.id) !== id));
	}

	function clear() { setItems([]); }

	function resolveImage(p) {
		const ph = p?.photos;
		if (Array.isArray(ph) && ph.length) {
			const f = ph[0];
			if (typeof f === 'string') return f;
			if (f && typeof f === 'object' && f.url) return f.url;
		}
		if (typeof ph === 'string') return ph;
		return p?.image || p?.img || p?.photo || p?.thumbnail || null;
	}

	const value = { items, count, total, addItem, removeItem, clear, updateQuantity, isReady };
	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { return useContext(CartContext); }
