const { connectDB } = require("../helpers/connectMongoDB");

const connectMiddleware = async (req, res, next) => {
  try {
    const db = await connectDB();
    req.db = db;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = connectMiddleware;
