const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid or expired token' });
      if (decoded.role !== 'euser') return res.status(403).json({ message: 'Forbidden' });
      req.euserId = decoded.id;
      req.user = { id: decoded.id, role: 'euser' };
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
