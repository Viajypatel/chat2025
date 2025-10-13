import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // 1️⃣ Get token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided or invalid format." });
    }

    // 2️⃣ Extract token after 'Bearer '
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 4️⃣ Attach user ID to the request
    req.id = decoded.userId;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default isAuthenticated;
