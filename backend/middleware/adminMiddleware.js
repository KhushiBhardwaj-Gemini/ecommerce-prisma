const ROLES = require("../constants/roles");
const adminMiddleware = (req, res, next) => {
    if(!req.user?.role === ROLES.ADMIN){
        return res.status(403).json({msg: "Requested user do not have adequate permissions to access"});
    }

    next();
}
module.exports = adminMiddleware;