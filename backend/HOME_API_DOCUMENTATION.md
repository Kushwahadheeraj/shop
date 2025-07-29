# Home Component APIs Documentation

This document provides comprehensive documentation for all the Home component APIs that have been created for the e-commerce application.

## Base URL
All APIs are prefixed with: `/api/home`

## Components Overview

1. **Service** - Service offerings (secure payment, customer support, etc.)
2. **Items** - Banner items with overlay and custom content
3. **Categories** - Product categories with images
4. **CardSlider** - Sliding card components
5. **Card** - Individual card components
6. **Tools** - Tool products
7. **ProductTools** - Detailed tool products with specifications
8. **Brands** - Brand information and logos
9. **PopularProducts** - Popular products with ratings
10. **HomeElectrical** - Electrical products for home
11. **HomePaints** - Paint products for home
12. **ImageSlider** - Image slider components

---

## 1. Service APIs

### Base URL: `/api/home/service`

#### Create Service
- **POST** `/create`
- **Body:**
  ```json
  {
    "icon": "ShieldCheck",
    "title": "SECURE PAYMENT",
    "description": "Your payment is secure with us"
  }
  ```
- **Response:** Service object with success message

#### Get All Services
- **GET** `/get`
- **Response:** Array of all services

#### Get One Service
- **GET** `/getOne/:id`
- **Response:** Single service object

#### Update Service
- **PUT** `/update/:id`
- **Body:** Same as create
- **Response:** Updated service object

#### Delete Service
- **DELETE** `/delete/:id`
- **Response:** Success message

---

## 2. Items APIs

### Base URL: `/api/home/items`

#### Create Item
- **POST** `/create`
- **Body:** FormData with fields:
  - `id` (required)
  - `image` (optional)
  - `alt` (optional)
  - `overlay` (boolean)
  - `title` (required)
  - `subtitle` (optional)
  - `description` (required)
  - `buttonText` (optional)
  - `textColor` (optional)
  - `content` (optional)
  - `uploadedImage` (file)
- **Response:** Item object with success message

#### Get All Items
- **GET** `/get`
- **Response:** Array of all items

#### Get One Item
- **GET** `/getOne/:id`
- **Response:** Single item object

#### Update Item
- **PUT** `/update/:id`
- **Body:** FormData (same as create)
- **Response:** Updated item object

#### Delete Item
- **DELETE** `/delete/:id`
- **Response:** Success message

---

## 3. Categories APIs

### Base URL: `/api/home/categories`

#### Create Category
- **POST** `/create`
- **Body:** FormData with fields:
  - `name` (required)
  - `image` (file)
  - `description` (optional)
  - `link` (optional)
  - `isActive` (boolean, default: true)
- **Response:** Category object with success message

#### Get All Categories
- **GET** `/get`
- **Response:** Array of active categories

#### Get One Category
- **GET** `/getOne/:id`
- **Response:** Single category object

#### Update Category
- **PUT** `/update/:id`
- **Body:** FormData (same as create)
- **Response:** Updated category object

#### Delete Category
- **DELETE** `/delete/:id`
- **Response:** Success message

---

## 4. CardSlider APIs

### Base URL: `/api/home/cardslider`

#### Create Card Slider
- **POST** `/create`
- **Body:** FormData with fields:
  - `title` (required)
  - `subtitle` (optional)
  - `image` (file)
  - `link` (optional)
  - `order` (number, default: 0)
  - `isActive` (boolean, default: true)
- **Response:** CardSlider object with success message

#### Get All Card Sliders
- **GET** `/get`
- **Response:** Array of active card sliders (sorted by order)

#### Get One Card Slider
- **GET** `/getOne/:id`
- **Response:** Single card slider object

#### Update Card Slider
- **PUT** `/update/:id`
- **Body:** FormData (same as create)
- **Response:** Updated card slider object

#### Delete Card Slider
- **DELETE** `/delete/:id`
- **Response:** Success message

---

## 5. Card APIs

### Base URL: `/api/home/card`

#### Create Card
- **POST** `/create`
- **Body:** FormData with fields:
  - `title` (required)
  - `subtitle` (optional)
  - `image` (file)
  - `link` (optional)
  - `category` (optional)
  - `isActive` (boolean, default: true)
- **Response:** Card object with success message

#### Get All Cards
- **GET** `/get`
- **Response:** Array of active cards

#### Get Cards by Category
- **GET** `/getByCategory/:category`
- **Response:** Array of cards filtered by category

#### Get One Card
- **GET** `/getOne/:id`
- **Response:** Single card object

#### Update Card
- **PUT** `/update/:id`
- **Body:** FormData (same as create)
- **Response:** Updated card object

#### Delete Card
- **DELETE** `/delete/:id`
- **Response:** Success message

---

## 6. Tools APIs

### Base URL: `/api/home/tools`

#### Create Tool
- **POST** `/create`
- **Body:** FormData with fields:
  - `name` (required)
  - `image` (file)
  - `description` (optional)
  - `category` (optional)
  - `price` (number, optional)
  - `isActive` (boolean, default: true)
- **Response:** Tool object with success message

#### Get All Tools
- **GET** `/get`
- **Response:** Array of active tools

#### Get Tools by Category
- **GET** `/getByCategory/:category`
- **Response:** Array of tools filtered by category

#### Get One Tool
- **GET** `/getOne/:id`
- **Response:** Single tool object

#### Update Tool
- **PUT** `/update/:id`
- **Body:** FormData (same as create)
- **Response:** Updated tool object

#### Delete Tool
- **DELETE** `/delete/:id`
- **Response:** Success message

---

## 7. ProductTools APIs

### Base URL: `/api/home/producttools`

#### Create Product Tool
- **POST** `/create`
- **Body:** FormData with fields:
  - `name` (required)
  - `image` (file)
  - `description` (optional)
  - `category` (optional)
  - `price` (number, optional)
  - `brand` (optional)
  - `specifications` (optional)
  - `isActive` (boolean, default: true)
- **Response:** ProductTool object with success message

#### Get All Product Tools
- **GET** `/get`
- **Response:** Array of active product tools

#### Get Product Tools by Category
- **GET** `/getByCategory/:category`
- **Response:** Array of product tools filtered by category

#### Get Product Tools by Brand
- **GET** `/getByBrand/:brand`
- **Response:** Array of product tools filtered by brand

#### Get One Product Tool
- **GET** `/getOne/:id`
- **Response:** Single product tool object

#### Update Product Tool
- **PUT** `/update/:id`
- **Body:** FormData (same as create)
- **Response:** Updated product tool object

#### Delete Product Tool
- **DELETE** `/delete/:id`
- **Response:** Success message

---

## 8. Brands APIs

### Base URL: `/api/home/brands`

#### Create Brand
- **POST** `/create`
- **Body:** FormData with fields:
  - `name` (required)
  - `logo` (file)
  - `description` (optional)
  - `website` (optional)
  - `isActive` (boolean, default: true)
- **Response:** Brand object with success message

#### Get All Brands
- **GET** `/get`
- **Response:** Array of active brands

#### Get One Brand
- **GET** `/getOne/:id`
- **Response:** Single brand object

#### Update Brand
- **PUT** `/update/:id`
- **Body:** FormData (same as create)
- **Response:** Updated brand object

#### Delete Brand
- **DELETE** `/delete/:id`
- **Response:** Success message

---

## 9. PopularProducts APIs

### Base URL: `/api/home/popularproducts`

#### Create Popular Product
- **POST** `/create`
- **Body:** FormData with fields:
  - `name` (required)
  - `image` (file)
  - `description` (optional)
  - `category` (optional)
  - `price` (number, optional)
  - `originalPrice` (number, optional)
  - `discount` (number, default: 0)
  - `rating` (number, default: 0)
  - `isActive` (boolean, default: true)
- **Response:** PopularProduct object with success message

#### Get All Popular Products
- **GET** `/get`
- **Response:** Array of active popular products (sorted by rating)

#### Get Popular Products by Category
- **GET** `/getByCategory/:category`
- **Response:** Array of popular products filtered by category

#### Get Top Rated Products
- **GET** `/getTopRated?limit=10`
- **Query Parameters:**
  - `limit` (optional, default: 10)
- **Response:** Array of top rated products

#### Get One Popular Product
- **GET** `/getOne/:id`
- **Response:** Single popular product object

#### Update Popular Product
- **PUT** `/update/:id`
- **Body:** FormData (same as create)
- **Response:** Updated popular product object

#### Delete Popular Product
- **DELETE** `/delete/:id`
- **Response:** Success message

---

## 10. HomeElectrical APIs

### Base URL: `/api/home/electrical`

#### Create Home Electrical Product
- **POST** `/create`
- **Body:** FormData with fields:
  - `name` (required)
  - `image` (file)
  - `description` (optional)
  - `category` (optional)
  - `price` (number, optional)
  - `originalPrice` (number, optional)
  - `discount` (number, default: 0)
  - `brand` (optional)
  - `specifications` (optional)
  - `isActive` (boolean, default: true)
- **Response:** HomeElectrical object with success message

#### Get All Home Electrical Products
- **GET** `/get`
- **Response:** Array of active home electrical products

#### Get Home Electrical Products by Category
- **GET** `/getByCategory/:category`
- **Response:** Array of home electrical products filtered by category

#### Get Home Electrical Products by Brand
- **GET** `/getByBrand/:brand`
- **Response:** Array of home electrical products filtered by brand

#### Get One Home Electrical Product
- **GET** `/getOne/:id`
- **Response:** Single home electrical product object

#### Update Home Electrical Product
- **PUT** `/update/:id`
- **Body:** FormData (same as create)
- **Response:** Updated home electrical product object

#### Delete Home Electrical Product
- **DELETE** `/delete/:id`
- **Response:** Success message

---

## 11. HomePaints APIs

### Base URL: `/api/home/paints`

#### Create Home Paint Product
- **POST** `/create`
- **Body:** FormData with fields:
  - `name` (required)
  - `image` (file)
  - `description` (optional)
  - `category` (optional)
  - `price` (number, optional)
  - `originalPrice` (number, optional)
  - `discount` (number, default: 0)
  - `brand` (optional)
  - `color` (optional)
  - `finish` (optional)
  - `isActive` (boolean, default: true)
- **Response:** HomePaint object with success message

#### Get All Home Paint Products
- **GET** `/get`
- **Response:** Array of active home paint products

#### Get Home Paint Products by Category
- **GET** `/getByCategory/:category`
- **Response:** Array of home paint products filtered by category

#### Get Home Paint Products by Brand
- **GET** `/getByBrand/:brand`
- **Response:** Array of home paint products filtered by brand

#### Get Home Paint Products by Color
- **GET** `/getByColor/:color`
- **Response:** Array of home paint products filtered by color

#### Get Home Paint Products by Finish
- **GET** `/getByFinish/:finish`
- **Response:** Array of home paint products filtered by finish

#### Get One Home Paint Product
- **GET** `/getOne/:id`
- **Response:** Single home paint product object

#### Update Home Paint Product
- **PUT** `/update/:id`
- **Body:** FormData (same as create)
- **Response:** Updated home paint product object

#### Delete Home Paint Product
- **DELETE** `/delete/:id`
- **Response:** Success message

---

## 12. ImageSlider APIs

### Base URL: `/api/home/imageslider`

#### Create Image Slider
- **POST** `/create`
- **Body:** FormData with fields:
  - `title` (required)
  - `subtitle` (optional)
  - `image` (file)
  - `category` (required, enum: ['PaintsImage', 'ToolsImage', 'SanitaryImage', 'FaucetImage', 'ElectricImage'])
  - `link` (optional)
  - `order` (number, default: 0)
  - `isActive` (boolean, default: true)
- **Response:** ImageSlider object with success message

#### Get All Image Sliders
- **GET** `/get`
- **Response:** Array of active image sliders (sorted by order)

#### Get Image Sliders by Category
- **GET** `/getByCategory/:category`
- **Response:** Array of image sliders filtered by category

#### Get One Image Slider
- **GET** `/getOne/:id`
- **Response:** Single image slider object

#### Update Image Slider
- **PUT** `/update/:id`
- **Body:** FormData (same as create)
- **Response:** Updated image slider object

#### Delete Image Slider
- **DELETE** `/delete/:id`
- **Response:** Success message

---

## Error Responses

All APIs return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Success Responses

All APIs return consistent success responses:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": "Object or array of objects"
}
```

## Image Upload

For APIs that support image upload:
- Use `multipart/form-data` content type
- Image files are automatically uploaded to Cloudinary
- The returned image URL is a secure Cloudinary URL

## Authentication

Currently, these APIs do not require authentication. In production, consider adding authentication middleware.

## Rate Limiting

Consider implementing rate limiting for production use.

---

## Database Models

Each component has its corresponding MongoDB model:

- `ServiceModel` - Service offerings
- `ItemsModel` - Banner items
- `CategoriesModel` - Product categories
- `CardSliderModel` - Sliding cards
- `CardModel` - Individual cards
- `ToolsModel` - Tool products
- `ProductToolsModel` - Detailed tool products
- `BrandsModel` - Brand information
- `PopularProductsModel` - Popular products
- `HomeElectricalModel` - Electrical products
- `HomePaintsModel` - Paint products
- `ImageSliderModel` - Image sliders

All models include timestamps and appropriate validation. 