const ROLES = require("../constants/roles");
const adminMiddleware = (req, res, next) => {
    if(!req.user?.role === ROLES.ADMIN){
        return res.status(403).json({msg: "Admin only"});
    }

    next();
}
module.exports = adminMiddleware;