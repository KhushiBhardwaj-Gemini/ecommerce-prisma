const jwt = require("jsonwebtoken");
const ROLES = require("../constants/roles");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ msg: "No token" });
  }
  try {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const requestedUserId =
      req.params?.id || req.body?.userId || req.query?.userId;

    if (requestedUserId) {
      const reqId = String(requestedUserId).trim();
      const tokenId = String(req.user.id).trim();

      if (reqId !== tokenId && req.user.role !== ROLES.ADMIN) {
        return res.status(403).json({
          msg: "Unauthorized: Token mismatch",
        });
      }
    }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
