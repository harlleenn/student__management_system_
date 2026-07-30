const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {

  // Grabing token from the authorization header
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];

  
  if (!accessToken) {
    return res.status(401).json({
      message: 'Unauthorized. No token provided.'
    });
    console.log(res.data.message)
  }
  try {
    // Verify the token

    const decoded = jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET);
    req.user = decoded; // Save user info in the request

    next(); // Continue to the next middleware or route
  } catch (error) {
    return res.status(403).json({ // 403 means you have access but not authorized to use it
     message: 'Forbidden - Invalid or expired tokennnn',
    });
  }
};

module.exports = authenticateToken;