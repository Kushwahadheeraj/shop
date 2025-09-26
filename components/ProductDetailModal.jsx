'use client';

import React from 'react';
import { X } from 'lucide-react';

function resolveImageUrl(item) {
  const photos = item && item.photos;
  if (Array.isArray(photos) && photos.length > 0) {
    const first = photos[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object' && first.url) return first.url;
  }
  if (typeof photos === 'string') return photos;
  return item?.image || item?.img || item?.photo || item?.thumbnail || null;
}

export default function ProductDetailModal({ product, isOpen, onClose }) {
  if (!isOpen || !product) return null;

  // Use the same robust price resolution logic as UniversalShopPage
  const originalPriceRaw = product?.mrp || product?.originalPrice || product?.price || product?.fixPrice || product?.minPrice;
  const salePriceRaw = product?.discountPrice || product?.price || product?.fixPrice || product?.minPrice;
  
  const originalPrice = originalPriceRaw > 0 ? originalPriceRaw : 0;
  const salePrice = salePriceRaw > 0 ? salePriceRaw : 0;
  
  const discount = originalPrice && salePrice && originalPrice > salePrice ? 
    Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;
  
  const img = resolveImageUrl(product);
  const rating = product?.rating || 5;
  const isOutOfStock = product?.stock === 0 || product?.quantity === 0;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Product Image */}
          <div className="lg:w-1/2 p-6">
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={img} 
                  alt={product.name} 
                  className="w-full h-96 object-contain rounded-lg bg-gray-50"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No Image Available</span>
                </div>
              )}
              
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discount}%
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-gray-600">({rating} out of 5)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4 mb-6">
              {originalPrice > 0 && originalPrice !== salePrice && salePrice > 0 && (
                <span className="text-gray-500 line-through text-lg">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-3xl font-bold text-gray-900">
                {salePrice > 0 ? `₹${salePrice.toLocaleString()}` : 
                 originalPrice > 0 ? `₹${originalPrice.toLocaleString()}` : 
                 'Price on request'}
              </span>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {isOutOfStock ? (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  Out of Stock
                </span>
              ) : (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  In Stock
                </span>
              )}
            </div>

            {/* Product Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Product Options */}
            {(product?.colors?.length > 0 || product?.variants?.length > 0 || product?.amps?.length > 0 || product?.weights?.length > 0) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Options</h3>
                
                {/* Colors */}
                {product?.colors?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Colors:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variants */}
                {product?.variants?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Variants:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((variant, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {variant}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amps */}
                {product?.amps?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Amps:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.amps.map((amp, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {amp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weights */}
                {product?.weights?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Weights:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.weights.map((weight, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {weight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {(product?.tags?.length > 0 || product?.tag?.length > 0) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {(product.tags || product.tag || []).map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button 
                className={`flex-1 py-3 px-6 rounded-lg text-lg font-medium transition-colors ${
                  isOutOfStock 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
                disabled={isOutOfStock}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Add to cart functionality can be added here
                  console.log('Add to cart:', product);
                }}
              >
                {isOutOfStock ? 'READ MORE' : 'ADD TO CART'}
              </button>
              <button 
                className={`flex-1 py-3 px-6 rounded-lg text-lg font-medium transition-colors ${
                  isOutOfStock 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                disabled={isOutOfStock}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Buy now functionality can be added here
                  console.log('Buy now:', product);
                }}
              >
                {isOutOfStock ? 'NOTIFY ME' : 'VIEW DETAILS'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">SKU:</span>
                  <span className="ml-2 text-gray-600">{product.sku || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Category:</span>
                  <span className="ml-2 text-gray-600">{product.category || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
