const ROLES = require("../constants/roles");
const sellerOrAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (!role) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  if (role !== ROLES.ADMIN && role !== ROLES.SELLER) {
    return res.status(403).json({ msg: "Seller or Admin only" });
  }

  next();
};

module.exports = sellerOrAdmin;
