const express = require('express');
const mongoose = require('mongoose');
const sellerRoutes = require('./routes/sellerRoutes');

// Test the routes
console.log('Testing seller routes...');
console.log('Available routes:');
console.log('- POST /api/seller/register');
console.log('- POST /api/seller/login');
console.log('- GET /api/seller/profile/me (protected)');
console.log('- PUT /api/seller/profile/me (protected)');
console.log('- PUT /api/seller/profile/password (protected)');
console.log('- GET /api/seller/:id');
console.log('- PUT /api/seller/:id');

console.log('\nRoutes loaded successfully!'); 