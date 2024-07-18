import jsonWebToken from "jsonwebtoken";
import multer from "multer";

export const authorizeMiddleware = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (token) {
    jsonWebToken.verify(token, process.env.JWT_SECRET_KEY, {}, (err, data) => {
      if (err || !data) {
        return res.status(401).json(data);
      }
    });
  }

  next();
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage: storage });
