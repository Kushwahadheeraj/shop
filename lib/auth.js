import jwt from 'jsonwebtoken';

/**
 * Next.js-compatible authentication middleware
 * Extracts and verifies JWT token from Authorization header
 * Returns the sellerId or throws an error
 */
export function verifyAuth(request) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not configured');
    }

    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      throw new Error('Authentication required - no token provided');
    }

    // Handle both "Bearer token" and direct token formats
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : authHeader;

    if (!token) {
      throw new Error('Authentication required - no token provided');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const sellerId = decoded.id || decoded._id || decoded.userId;

    if (!sellerId) {
      throw new Error('Invalid token - no sellerId found');
    }

    return sellerId;
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new Error('Invalid or expired token');
    }
    throw error;
  }
}

