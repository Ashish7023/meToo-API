// Import the jsonwebtoken module for verifying JWT tokens
const jwt = require("jsonwebtoken");

// Import the User model to fetch user data from the database
const User = require("../Models/userModels");

// Middleware function to protect routes and ensure user authentication
const protect = async (req, res, next) => {
  // Extract the authorization header from the incoming request
  const authorization = req.headers.authorization;
  
  // Check if the authorization header is present and properly formatted
  if (!authorization || !authorization.startsWith("Bearer ")) {
    // If not, respond with a 401 Unauthorized status
    return res.sendStatus(401);
  }

  // Extract the JWT token from the authorization header
  const token = authorization.split(" ")[1];
  
  // Check if the token is present
  if (!token) {
    // If not, respond with a 401 Unauthorized status
    return res.sendStatus(401);
  }

  try {
    // Verify the token using the JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the decoded token's ID
    req.user = await User.findById(decoded.id);

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Log any errors that occur during token verification or user retrieval
    console.log(error.message);

    // Respond with a 401 Unauthorized status in case of an error
    return res.sendStatus(401);
  }
};

// Export the protect middleware function
module.exports = { protect };
