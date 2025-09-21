# Bill Management System

A comprehensive bill management system for tracking shop transactions, managing bills, and handling payments.

## Features

### 🏪 Shop Management
- Add and manage multiple shops
- Store shop details including contact information, location, and business details
- Track shop statistics and recent transactions
- Support for GST and PAN number validation

### 💰 Bill Management
- Create detailed bills with multiple items
- Automatic calculation of subtotal, GST, and total amounts
- Support for different payment methods (Cash, Card, UPI, Bank Transfer, Cheque)
- Track payment status (Pending, Paid, Partial, Overdue)
- Recurring transaction support
- Bill status tracking (Draft, Sent, Paid, Overdue, Cancelled)

### 🤖 AI Receipt Scanning
- Upload receipt images for automatic data extraction
- AI-powered text recognition and data parsing
- Automatic item detection and pricing
- Shop name and address extraction
- Support for multiple image formats (JPG, PNG, PDF)

### 📊 Analytics & Reporting
- Real-time statistics dashboard
- Total bills, amounts, and payment tracking
- Shop-wise bill analysis
- Payment status breakdown
- Date range filtering

## File Structure

```
app/Dashboard/BillManagement/
├── page.js                    # Main bill management page
├── AddBillForm.jsx           # Bill creation form
├── AddShopForm.jsx           # Shop creation form
├── AIReceiptScanner.jsx      # AI receipt scanning component
└── README.md                 # This file

backend/
├── models/
│   ├── Bill.js              # Bill data model
│   └── Shop.js              # Shop data model
├── controllers/
│   ├── billController.js    # Bill management logic
│   └── shopController.js    # Shop management logic
└── routes/
    ├── billRoutes.js        # Bill API routes
    └── shopRoutes.js        # Shop API routes
```

## API Endpoints

### Bills
- `GET /api/bills` - Get all bills with filtering
- `POST /api/bills` - Create a new bill
- `GET /api/bills/:id` - Get bill by ID
- `PUT /api/bills/:id` - Update bill
- `DELETE /api/bills/:id` - Delete bill
- `GET /api/bills/stats` - Get bill statistics

### Shops
- `GET /api/shops` - Get all shops
- `POST /api/shops` - Create a new shop
- `GET /api/shops/:id` - Get shop by ID
- `PUT /api/shops/:id` - Update shop
- `DELETE /api/shops/:id` - Delete shop
- `GET /api/shops/stats` - Get shop statistics

## Usage

### Creating a Shop
1. Click "Add Shop" button
2. Fill in shop details (name, address, contact info)
3. Add business details (GST, PAN numbers)
4. Set financial terms and credit limits
5. Save the shop

### Creating a Bill
1. Click "Add Bill" button
2. Select a shop from the dropdown
3. Add items with quantities and prices
4. Review calculated totals and GST
5. Set payment details and due date
6. Save the bill

### AI Receipt Scanning
1. Click "Scan Receipt with AI" button
2. Upload a clear image of the receipt
3. Wait for AI processing
4. Review extracted data
5. Use the data to create a bill

## Data Models

### Bill Schema
```javascript
{
  billNumber: String,        // Auto-generated bill number
  shopId: ObjectId,          // Reference to shop
  shopName: String,          // Shop name (denormalized)
  shopAddress: String,       // Shop address (denormalized)
  items: [{                  // Array of items
    name: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number,
    category: String,
    description: String
  }],
  pricing: {                 // Pricing details
    subtotal: Number,
    gstRate: Number,
    gstAmount: Number,
    totalAmount: Number,
    discount: Number
  },
  payment: {                 // Payment details
    method: String,
    status: String,
    paidAmount: Number,
    remainingAmount: Number
  },
  billDate: Date,
  dueDate: Date,
  status: String,
  recurring: {               // Recurring transaction
    isRecurring: Boolean,
    frequency: String
  },
  createdBy: ObjectId        // User who created the bill
}
```

### Shop Schema
```javascript
{
  name: String,              // Shop name
  address: String,           // Shop address
  contact: {                 // Contact information
    phone: String,
    email: String,
    ownerName: String
  },
  location: {                // Location details
    city: String,
    state: String,
    pincode: String
  },
  business: {                // Business details
    type: String,
    gstNumber: String,
    panNumber: String,
    licenseNumber: String
  },
  financial: {               // Financial terms
    creditLimit: Number,
    paymentTerms: String
  },
  status: String,            // Active/Inactive
  createdBy: ObjectId        // User who created the shop
}
```

## Features in Detail

### Automatic Calculations
- Subtotal: Sum of all item quantities × unit prices
- GST Amount: (Subtotal × GST Rate) / 100
- Total Amount: Subtotal + GST Amount - Discount
- Remaining Amount: Total Amount - Paid Amount

### Validation
- Required field validation
- Email format validation
- Phone number format validation
- GST number format validation (Indian format)
- PAN number format validation (Indian format)

### Filtering and Search
- Filter bills by shop
- Filter bills by status
- Search bills by bill number, shop name, or description
- Date range filtering
- Payment status filtering

## Future Enhancements

- [ ] PDF bill generation
- [ ] Email bill sending
- [ ] Advanced AI receipt scanning with real OCR
- [ ] Bulk bill operations
- [ ] Export to Excel/CSV
- [ ] Advanced reporting and analytics
- [ ] Mobile app integration
- [ ] Barcode scanning for items
- [ ] Inventory integration
- [ ] Multi-currency support

## Dependencies

### Frontend
- React
- Next.js
- Lucide React (icons)
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer (file uploads)

## Setup Instructions

1. Ensure the backend server is running on port 5000
2. The frontend will automatically connect to the backend API
3. Authentication is required to access the bill management features
4. Only sellers can access the dashboard and bill management

## Security Notes

- All API routes are protected with authentication middleware
- File uploads are validated for type and size
- Input validation prevents SQL injection and XSS attacks
- Sensitive data is properly sanitized before storage
