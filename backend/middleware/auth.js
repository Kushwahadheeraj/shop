const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required - no token provided' 
      });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid or expired token' 
        });
      }
      
      req.sellerId = decoded.id || decoded._id || decoded.userId;
      
      if (!req.sellerId) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid token - no sellerId found' 
        });
      }
      
      next();
    });
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Authentication failed' 
    });
  }
};
