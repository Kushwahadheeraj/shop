const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      console.log('Decoded token:', decoded);
      req.sellerId = decoded.id || decoded._id || decoded.userId;
      console.log('Set sellerId to:', req.sellerId);
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
}; 