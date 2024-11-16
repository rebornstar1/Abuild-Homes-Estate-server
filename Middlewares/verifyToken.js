const jwt = require('jsonwebtoken');

const verifyToken = (roles) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden. Access not allowed." });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = verifyToken;
