const sellerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  if (req.user.role !== "ADMIN" && req.user.role !== "SELLER") {
    return res.status(403).json({ msg: "Seller or Admin only" });
  }

  next();
};

module.exports = sellerOrAdmin;
