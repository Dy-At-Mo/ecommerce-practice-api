import jwt from "jsonwebtoken";



export function checkAuth(req, res, next) {
  /// get cookie
  const token = req.cookies.node_api_token;


  // Check if token exists
  if (!token) {
    return res.status(401).json({
      error: "invalid token",
    });
  }

  
  try {
    /// verify cookie jwt
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;

    /// if ok next()
    next();
  } catch {
    /// if not ok error
    return res.status(401).json({
      error: "invalid token",
    });
  }
}
