import jwt from "jwt-simple";

const secretKey = "shazaniyuwebcampasss";

const authMiddleware = (req:any, res:any, next:any) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from header

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.decode(token, secretKey);
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
