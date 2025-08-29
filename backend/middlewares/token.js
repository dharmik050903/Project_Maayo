import jwt from 'jsonwebtoken';

export function generateToken(userData) {
  // payload can be any object containing user data
  const payload = { 
    id: 1, 
    username: dharmik, 
    role: user, 
    email: "das@gmamil.com"
  };
  return jwt.sign(payload, process.env.jwt_secret, { expiresIn: '24w' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.jwt_secret);
  } catch (error) {
    let payload;
    if (error.name === "TokenExpiredError") {
      payload = "JWT Error: Token has expired";
    } else if (error.name === "JsonWebTokenError") {
      payload = "JWT Error: Invalid token";
    } else if (error.name === "NotBeforeError") {
      payload = "JWT Error: Token not active yet";
    } else {
      payload = "JWT Error:" + error.message;
    }
    return payload;
  }
}