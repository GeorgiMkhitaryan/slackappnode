const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(305)
        .json({ authorization: false, message: "User is not logged" });
    }
    const decodedData = jwt.verify(token.split(" ")[1], secret);
    req.user = decodedData;
    next();
  } catch (e) {
    return res
      .status(305)
      .json({ authorization: false, message: "User is not logged" });
  }
};
