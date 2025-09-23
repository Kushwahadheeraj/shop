const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('❌ No token provided in request');
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required - no token provided' 
      });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('❌ Token verification failed:', err.message);
        return res.status(401).json({ 
          success: false,
          message: 'Invalid or expired token' 
        });
      }
      
      console.log('✅ Token decoded successfully:', decoded);
      req.sellerId = decoded.id || decoded._id || decoded.userId;
      console.log('✅ Set sellerId to:', req.sellerId);
      
      if (!req.sellerId) {
        console.log('❌ No sellerId found in token');
        return res.status(401).json({ 
          success: false,
          message: 'Invalid token - no sellerId found' 
        });
      }
      
      next();
    });
  } catch (error) {
    console.log('❌ Authentication middleware error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Authentication failed' 
    });
  }
}; 