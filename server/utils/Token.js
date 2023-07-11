const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateJWT = (email) => {
  const now = new Date();
  const payload = {
    email,
    exp: now.getTime() + 30 * 24 * 60 * 60 * 1000 , // expires in 30 days
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { algorithm: "HS256" });
};

const validateJWT = (token) => {
  const jwt = require("jsonwebtoken");
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(decodedToken.exp<Date.now())
        return false
    else
        return true
  } catch (error) {
    return false
  }
};

module.exports = {
  generateJWT,
  validateJWT
};