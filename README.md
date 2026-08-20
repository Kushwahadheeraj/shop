# Kushwaha Hardware — Full-Stack E-Commerce & Shop Management Platform

Kushwaha Hardware is a full-stack hardware/electrical e-commerce and business-management platform. The project is organized as a monorepo containing:

- **Shop Frontend** — customer-facing online store built with Next.js.
- **Seller Dashboard** — admin/seller dashboard for products, orders, billing, inventory and analytics.
- **Backend API** — Express.js REST API with MongoDB/Mongoose, authentication, payments, uploads and business-management modules.

---

## ✨ Main Features

### Customer Store

The customer application provides an online shopping experience for hardware, electrical, construction and home-improvement products.

Key areas include:

- Home page with promotional sections and product collections
- Shop/category browsing
- Product details and product listings
- Search/filter-oriented category pages
- Shopping cart
- User authentication
- Customer orders
- Product reviews
- Coupons/discount support
- Payment integration
- Product images and gallery
- Dynamic product/category content
- Responsive UI for desktop and mobile

The store contains a large catalog structure covering categories such as:

- Electrical products
- Fans and lights
- Wires and cables
- Switches, sockets and accessories
- Hardware
- Paint
- Cement
- Adhesives
- Cleaning products
- Fittings
- Fiber
- Pipes/PVC materials
- Sanitary products
- Tools
- Locks and door accessories
- Roofing/waterproofing
- Home décor
- Other/uncategorized products

---

## 🧑‍💼 Seller / Admin Dashboard

The dashboard is designed for sellers/admins to manage the business from a central interface.

Major modules include:

- Dashboard analytics
- Product inventory
- Product creation/editing
- Category management
- Orders
- Delivered orders
- User/customer management
- Coupons
- Gallery management
- Bill management
- GST bill management
- Invoice generation
- Invoice templates
- Business profile management
- Client management
- Bank account management
- Balance entries
- Bill file management
- Bill item inventory
- Shop management
- Product analytics
- Sales and bill analytics

The dashboard also includes chart-based analytics using Recharts and authentication-based access control for seller/admin users.

---

## 🧾 Billing & Invoice Management

The project contains an extensive billing system.

Supported functionality includes:

- Regular bills
- Simple bills
- GST bills
- Invoice generation
- Invoice previews
- Invoice templates
- Client/customer records
- Business profiles
- Bank details
- Payment records
- Balance entries
- Bill files
- Bill item inventory
- Bill analytics
- Receipt scanning / AI-assisted receipt processing

PDF-related functionality is supported through libraries such as `jspdf`, `pdf-parse`, `puppeteer` and `html2canvas`.

---

## 🤖 AI / Automation

The codebase contains integrations and utilities for AI-assisted functionality, including:

- Google Generative AI
- OpenAI-related configuration
- Receipt/OCR processing
- AI receipt scanner
- OCR Space configuration
- Optional mock/automation modes

AI/OCR features depend on the corresponding environment variables and external services being configured.

---

## 💳 Payments & Notifications

The backend contains payment and notification-related integrations.

### Payments

Razorpay is included for payment processing.

Relevant environment variables include:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

### Email

Nodemailer is used for email functionality.

Environment variables:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

### SMS

Fast2SMS configuration is supported through:

- `FAST2SMS_API_KEY`

---

## ☁️ File & Image Storage

The backend supports multiple file/image mechanisms.

### Cloudinary

Cloudinary configuration is available through:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Local / GridFS Files

The Express server serves uploaded files through `/uploads` and also exposes a GridFS file endpoint:

```text
GET /files/:id
```

---

# 🏗️ Project Structure

```text
shop-master/
│
├── app/
│   ├── shop/
│   │   ├── app/
│   │   │   ├── Home/
│   │   │   ├── ShopPage/
│   │   │   ├── Orders/
│   │   │   ├── Cart/
│   │   │   ├── Login/
│   │   │   ├── Product/
│   │   │   └── ...
│   │   ├── components/
│   │   ├── context/
│   │   ├── public/
│   │   ├── package.json
│   │   └── ...
│   │
│   └── dashboard/
│       ├── app/
│       │   ├── BillManagement/
│       │   ├── GSTBillManagement/
│       │   ├── InvoiceGenerator/
│       │   ├── ProductAdd/
│       │   ├── ItemsInventory/
│       │   ├── Orders/
│       │   ├── Coupons/
│       │   ├── Gallery/
│       │   ├── BalanceManagement/
│       │   └── ...
│       ├── components/
│       ├── package.json
│       └── ...
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── README.md
│
├── package.json
├── package-lock.json
└── vercel.json
```

---

# 🧩 Technology Stack

## Frontend / Store

- Next.js
- React
- Tailwind CSS
- React Icons
- Lucide React
- Radix UI
- Recharts
- Embla Carousel
- JWT-based authentication
- Client-side cart/auth providers

## Seller Dashboard

- Next.js
- React
- Tailwind CSS
- Radix UI
- Recharts
- Lucide React
- jsPDF
- Puppeteer
- html2canvas
- QRCode React
- Google Generative AI

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary
- Nodemailer
- Razorpay
- CORS
- dotenv

---

# 🔐 Authentication

The project uses JWT-based authentication.

The backend exposes seller authentication routes under:

```text
/api/seller
```

Example operations include:

```text
POST /api/seller/register
POST /api/seller/login
GET  /api/seller/me
POST /api/seller/change-password
```

Authenticated requests use a bearer token:

```http
Authorization: Bearer <JWT_TOKEN>
```

The dashboard checks the authenticated user's role and allows access to seller/admin users.

---

# 🔌 Backend API

The Express backend is mounted under the `/api` prefix.

Important route groups include:

```text
/api/seller
/api/euser
/api/orders
/api/products
/api/simple-products
/api/reviews
/api/coupons
/api/category-count
/api/upload
/api/bills
/api/simple-bills
/api/invoices
/api/invoice-business-profiles
/api/shops
/api/gst-shops
/api/gst-bills
/api/clients
/api/balance-entries
/api/bill-files
/api/bank-accounts
/api/dashboard
/api/adhesives
/api/brush
/api/cements
/api/cleaning
/api/dry
/api/electrical
/api/fiber
/api/fitting
/api/hardware
/api/home
/api/homedecor
/api/locks
/api/paint
/api/pipe
/api/pvcmats
/api/roofer
/api/sanitary
/api/tools
/api/uncategorized
/api/waterproofing
/api/shop-management
/api/gallery
/api/payments
```

The category-specific routes are backed by dedicated controllers and MongoDB models.

---

# 🗄️ Database

MongoDB is used as the primary database.

The backend connects through Mongoose and requires:

```env
MONGO_URI=your_mongodb_connection_string
```

The database layer includes connection error handling, reconnect/disconnect monitoring and configurable connection timeouts.

---

# ⚙️ Environment Variables

Create the required `.env` files before running the project.

A typical backend configuration may contain:

```env
PORT=5000

MONGO_URI=mongodb://localhost:27017/shop
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

FAST2SMS_API_KEY=

OPENAI_API_KEY=
NEXT_PUBLIC_OPENAI_API_KEY=

HF_TOKEN=
HF_MODEL=

OCR_SPACE_API_KEY=

OPENAI_MOCK=false
USE_MOCK=false
```

Frontend applications may use:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_BACKEND_URL=
BACKEND_URL=
BACKEND_API_URL=
API_BASE_URL=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
NEXT_PUBLIC_SELLER_LOGIN_KEY=
```

> Do not commit real API keys, passwords, database credentials or JWT secrets to Git.

---

# 🚀 Installation

## 1. Clone the repository

```bash
git clone <repository-url>
cd shop-master
```

## 2. Install all dependencies

From the project root:

```bash
npm install
```

The root project uses npm workspaces for:

```text
app/shop
app/dashboard
backend
```

You can also use:

```bash
npm run install:all
```

---

# ▶️ Running the Project

The project contains three major applications/services.

## Backend

Run:

```bash
npm run dev:backend
```

or:

```bash
cd backend
npm run dev
```

The backend normally starts on:

```text
http://localhost:5000
```

API base:

```text
http://localhost:5000/api
```

---

## Customer Shop

Run:

```bash
npm run dev:shop
```

The shop application is configured for:

```text
http://localhost:3000
```

---

## Seller Dashboard

Run:

```bash
npm run dev:dashboard
```

The dashboard application is configured for:

```text
http://localhost:3001
```

---

# 🏭 Production Builds

## Shop

```bash
npm run build:shop
```

The shop's package configuration uses a production Next.js standalone server.

## Dashboard

```bash
npm run build:dashboard
```

## Backend

```bash
npm run build:backend
```

or:

```bash
cd backend
npm install
```

---

# 📜 Available Root Scripts

| Command | Purpose |
|---|---|
| `npm run dev:shop` | Start customer shop |
| `npm run dev:dashboard` | Start seller dashboard |
| `npm run dev:backend` | Start backend |
| `npm run build:shop` | Build customer shop |
| `npm run build:dashboard` | Build seller dashboard |
| `npm run build:backend` | Install/build backend dependencies |
| `npm run build:render` | Backend build command for Render |
| `npm run install:all` | Install workspace dependencies |
| `npm start` | Start backend workspace |

---

# 🔄 Application Architecture

The high-level request flow is:

```text
Customer Browser
      │
      ▼
Next.js Shop
      │
      │ HTTP / REST API
      ▼
Express.js Backend
      │
      ├── Authentication
      ├── Products
      ├── Orders
      ├── Reviews
      ├── Coupons
      ├── Billing
      ├── GST / Invoices
      ├── Payments
      ├── Uploads
      └── Analytics
      │
      ▼
MongoDB
```

Seller flow:

```text
Seller/Admin
     │
     ▼
Next.js Dashboard
     │
     ▼
Express API
     │
     ├── Inventory
     ├── Orders
     ├── Billing
     ├── GST
     ├── Invoices
     ├── Clients
     ├── Shops
     └── Analytics
     │
     ▼
MongoDB
```

---

# 🛠️ Development Notes

### API URL Configuration

The frontend contains multiple environment-variable names for backend/API configuration. Make sure the variable used by the relevant API helper matches the deployment environment.

### Authentication

Make sure the backend `JWT_SECRET` is configured consistently across environments.

### MongoDB

The backend will terminate startup if `MONGO_URI` is missing.

### Payment

Razorpay functionality requires both server-side and client-side configuration.

### Uploads

If using Cloudinary, configure all Cloudinary credentials. If using local/GridFS storage, make sure the deployment environment supports persistent file storage where required.

### Memory-intensive Builds

The shop and dashboard build scripts increase Node.js heap size because the project contains a large number of routes/components.

---

# ☁️ Deployment

The repository includes a `vercel.json` configuration for deploying the backend as a Vercel Node function.

The current Vercel configuration points requests to:

```text
backend/server.js
```

For a production deployment, configure the required environment variables in the hosting provider and verify that the frontend's API URL points to the deployed backend.

For platforms such as Render, the repository also contains a root script:

```bash
npm run build:render
```

which prepares the backend dependencies.

---

# 🧪 Recommended Local Development Order

For the first setup:

```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:shop

# Terminal 3
npm run dev:dashboard
```

Then verify:

```text
Backend    → http://localhost:5000
Shop       → http://localhost:3000
Dashboard  → http://localhost:3001
```

Before testing authenticated features, make sure MongoDB is reachable and the JWT configuration is present.

---

# 📁 Backend Organization

The backend follows a controller/route/model architecture.

```text
backend/
├── config/
│   ├── db.js
│   └── cloudinary.js
│
├── controllers/
│   ├── product controllers
│   ├── order controllers
│   ├── billing controllers
│   ├── dashboard controllers
│   ├── category controllers
│   └── home/category controllers
│
├── models/
│   └── MongoDB/Mongoose schemas
│
├── routes/
│   └── REST API route definitions
│
├── middleware/
│   └── authentication/validation helpers
│
└── server.js
```

This separation makes it possible to add new product categories and business modules without placing all logic in a single server file.

---

# 📦 Product Category Architecture

The repository uses separate frontend pages, backend routes/controllers and models for many product categories.

For example:

```text
ShopPage/
└── Electrical/
    ├── Fans/
    ├── Lights/
    ├── Switches/
    ├── Sockets/
    ├── WiresAndCables/
    ├── MCB/
    ├── Motors/
    └── ...
```

The seller dashboard mirrors this architecture under product-add screens:

```text
ProductAdd/
└── Electrical/
    ├── Fans/
    ├── Lights/
    ├── Switches/
    ├── Sockets/
    └── ...
```

This allows sellers to manage category-specific product data while the customer application presents the corresponding storefront pages.

---

# 🔒 Security Recommendations

Before production deployment:

- Use strong random values for `JWT_SECRET`.
- Never expose private API keys in frontend code.
- Do not commit `.env` files.
- Restrict CORS to trusted production domains.
- Validate and sanitize uploaded files.
- Configure secure MongoDB credentials.
- Use HTTPS in production.
- Verify Razorpay signatures on the server.
- Rotate leaked or previously exposed credentials.
- Add rate limiting to authentication and payment endpoints.
- Review seller/admin authorization on every protected API route.

---

# 🐛 Troubleshooting

## Backend does not start

Check:

```text
MONGO_URI
JWT_SECRET
PORT
```

Then run:

```bash
cd backend
npm install
npm start
```

## Frontend cannot reach API

Check the frontend API environment variables and make sure the backend is running.

For local development, verify that requests ultimately reach:

```text
http://localhost:5000/api
```

## Authentication fails

Verify:

1. Backend is running.
2. MongoDB is connected.
3. `JWT_SECRET` is configured.
4. The browser has a valid token.
5. The API URL is correct.

## Payment does not work

Verify:

```text
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID
```

and confirm that the correct test/live Razorpay credentials are being used.

---

# 📌 Project Summary

**Kushwaha Hardware** is not only an e-commerce storefront; it is a combined commerce and business-management system.

It brings together:

- 🛒 Online shopping
- 📦 Product & inventory management
- 👥 Customer/user management
- 🚚 Order management
- 🎟️ Coupons
- 💳 Payments
- 🧾 Billing
- 🧮 GST invoicing
- 📊 Business analytics
- 🏦 Bank/account management
- 🖼️ Gallery & media management
- 🤖 AI/OCR-assisted workflows
- 📧 Email/SMS integrations
- ☁️ Cloud file/image storage

The architecture is designed as a workspace-based monorepo so the customer storefront, seller dashboard and backend API can be developed and deployed as separate applications while sharing the same overall project structure.
