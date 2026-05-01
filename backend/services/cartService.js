const prisma = require("../config/prisma");
const logger = require("../utils/logger");

//add to cart
const addToCart = async (userId, productId) => {
  logger.info(`User ${userId} added product ${productId} to cart`);
  return await prisma.$transaction(async (tx) => {
    //if product exists -check
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      logger.warn(`Product not found: ${productId}`);
      throw new Error("Product not found");
    }

    return await tx.cart.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update : {
        quantity: {
          increment: 1,
        },
      },
      create: {
        userId,
        productId,
        quantity: 1,
      },
    });
  });
};

const getCart = async (userId) => {
  return await prisma.cart.findMany({
    where: {
      userId: userId,
    },
    include: {
      product: true,
    },
  });
};

const clearCart = async (userId) => {
  logger.info(`User ${userId} cleared cart`);
  return await prisma.cart.deleteMany({
    where: {
      userId: userId,
    },
  });
};

const updateQuantity = async (userId, productId, type) => {
  logger.info(`User ${userId} updated quantity of ${productId}`);
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.cart.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
    });

    if (!existing) {
      logger.warn(`Item not in cart: ${productId}`);
      throw new Error("Item not in cart");
    }
    //decrease
    if (type === "decrease") {
      if (existing.quantity === 1) {
        //remove item from cart
        return await tx.cart.delete({
          where: {
            userId_productId: {
              userId,
              productId,
            },
          },
        });
      }

      return await tx.cart.update({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
        data: {
          quantity: existing.quantity - 1,
        },
      });
    }
    //increase
    return await tx.cart.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        quantity: existing.quantity + 1,
      },
    });
  });
};

module.exports = {
  addToCart,
  getCart,
  clearCart,
  updateQuantity,
};
