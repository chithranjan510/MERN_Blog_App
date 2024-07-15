import jsonWebToken from "jsonwebtoken";

export const authorizeMiddleware = (req, res, next) => {
  const path = req.path;

  if (path.includes("login") || path.includes("register")) {
    return next();
  }

  const token = req.headers.cookie.split("=")[1];

  jsonWebToken.verify(token, process.env.JWT_SECRET_KEY, {}, (err, data) => {
    if (err || !data) {
      return res.status(401).json({ message: "Unautharize access" });
    }
  });

  next();
};
