const prisma = require("../config/prisma");
const logger = require("../utils/logger");

//get products for admin(dashboard)
const getAllProductsAdmin = async () => {
    logger.info("Admin requested all products dashboard");
    return await prisma.product.findMany({
        select: {
            id: true,
            title: true,
            price: true,
            category: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select:{
                    name: true,
                    email: true,
                },
            },
        },
        orderBy:{
            createdAt: "desc",
        },
    });
};

//get users who added that product into cart
const getProductUsers = async (productId) => {
    logger.info(`Admin fetching users for product ${productId}`);
    return await prisma.product.findUnique({
        where: {id: productId},
        include: {
            cart: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            createdAt: true,
                        },
                    },
                },
            },
        },
    });
};


module.exports = {
  getAllProductsAdmin,
  getProductUsers,
};