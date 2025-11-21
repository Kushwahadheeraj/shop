"use client";
import React from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';

export default function CartPreview({ open }) {
	const { items, total } = useCart() || { items: [], total: 0 };
	if (!open) return null;
	return (
		<div className="absolute right-0 top-full mt-2 w-80 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 z-[1000]">
			<div className="max-h-80 overflow-auto divide-y">
				{items.length === 0 && (
					<div className="p-4 text-sm text-gray-500">Your cart is empty.</div>
				)}
				{items.map((it) => {
					const compositeKey = `${it._id || it.id}||${JSON.stringify({
						color: it.color || '',
						colour: it.colour || '',
						weight: it.weight || '',
						amp: it.amp || '',
						variant: it.variant || '',
						typeOption: it.typeOption || '',
						brand: it.brand || '',
						way: it.way || ''
					})}`;
					return (
						<div key={compositeKey} className="flex items-center gap-3 p-3">
							<div className="w-14 h-14 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
								{it.thumbnail ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img src={it.thumbnail} alt={it.name} className="w-full h-full object-contain" />
								) : (
									<span className="text-xs text-gray-400">No Image</span>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium truncate">{it.name}</p>
								<p className="text-xs text-gray-500">Qty: {it.quantity}</p>
							</div>
							<div className="text-sm font-semibold">₹{Number(it.price || 0).toLocaleString()}</div>
						</div>
					);
				})}
			</div>
			<div className="p-4">
				<div className="flex justify-between items-center mb-3">
					<span className="text-sm text-gray-600">Subtotal:</span>
					<span className="text-lg font-bold">₹{Number(total).toLocaleString()}</span>
				</div>
				<div className="flex gap-2">
					<Link href="/cart" className="flex-1 text-center bg-yellow-300 hover:bg-yellow-300 text-white font-semibold py-2 rounded-md text-sm">VIEW CART</Link>
					<Link href="/checkout" className="flex-1 text-center bg-gray-900 hover:bg-black text-white font-semibold py-2 rounded-md text-sm">CHECKOUT</Link>
				</div>
			</div>
		</div>
	);
}
