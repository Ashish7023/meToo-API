const jwt = require("jsonwebtoken");
const generateToken = (id) => {
  const Token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return Token;
};

module.exports = generateToken;
