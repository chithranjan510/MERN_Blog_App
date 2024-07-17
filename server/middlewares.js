import jsonWebToken from "jsonwebtoken";

export const authorizeMiddleware = (req, res, next) => {
  const path = req.path;

  const { token } = req.cookies;

  if (token) {
    jsonWebToken.verify(token, process.env.JWT_SECRET_KEY, {}, (err, data) => {
      if (err || !data) {
        return res.status(401).json(data);
      }
    });
  }

  if (
    !token &&
    (path.includes("create") ||
      path.includes("edit") ||
      path.includes("profile"))
  ) {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};
