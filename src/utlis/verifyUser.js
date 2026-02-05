import jwt from "jsonwebtoken";
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.authtoken;
    if (!token) {
      return res.status(400).json({
        message: "Unautorized!token is missing",
        success: false,
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({
      message: error,
      success: false,
    });
  }
};
