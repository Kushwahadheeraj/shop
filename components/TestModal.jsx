'use client';

import React, { useState } from 'react';

export default function TestModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Modal</h1>
      
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Modal
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Test Modal Content</h2>
            <p className="mb-4">This is a test modal to verify functionality.</p>
            <button 
              onClick={() => setIsOpen(false)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
