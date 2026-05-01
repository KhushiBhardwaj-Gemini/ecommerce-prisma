const prisma =  require("../config/prisma");
const logger = require("../utils/logger");

const logAction = async({ userId, action, entity, entityId }) => {
    try{
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId,
            },
        });
        logger.info(`Audit: ${action} on ${entity} by user ${userId}`);
    } catch(err){
        logger.error(`Audit log failed: ${err.message}`);
    }
};

module.exports = { logAction };