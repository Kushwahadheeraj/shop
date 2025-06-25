# Shop Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the backend folder:
   ```env
   MONGO_URI=mongodb://localhost:27017/shop
   JWT_SECRET=your_jwt_secret
   ```
3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /api/seller/register` — Register seller (for testing)
- `POST /api/seller/login` — Login seller
- `GET /api/seller/me` — Get seller info (auth required)
- `POST /api/seller/change-password` — Change password (auth required) 