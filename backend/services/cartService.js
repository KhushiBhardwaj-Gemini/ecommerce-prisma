const prisma = require("../config/prisma");
const logger = require("../utils/logger");
const { logAction } = require("./auditService");

//add to cart
const addToCart = async (userId, productId) => {
  return await prisma.$transaction(async (tx) => {
    //if product exists -check
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      logger.warn(`Product not found: ${productId}`);
      throw new Error("Product not found");
    }

    const result = await tx.cart.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
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
    logger.info(`User ${userId} added product ${productId} to cart`);
    await logAction({
      userId,
      action: "ADD_TO_CART",
      entity: "CART",
      entityId: productId,
    });

    return result;
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
  const res = await prisma.cart.deleteMany({
    where: {
      userId: userId,
    },
  });
  logger.info(`User ${userId} cleared cart`);
  await logAction({
    userId,
    action: "CLEAR_CART",
    entity: "CART",
  });
  return res;
};

const updateQuantity = async (userId, productId, type) => {
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

    let result;
    //decrease
    if (type === "decrease") {
      if (existing.quantity === 1) {
        //remove item from cart
        result = await tx.cart.delete({
          where: {
            userId_productId: {
              userId,
              productId,
            },
          },
        });
      } else {
        result = await tx.cart.update({
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
    }
    //increase
    else {
      result = await tx.cart.update({
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
    }
    logger.info(`User ${userId} updated quantity of ${productId}`);
    await logAction({
      userId,
      action: "UPDATE_CART",
      entity: "CART",
      entityId: productId,
    });
    return result;
  });
};

module.exports = {
  addToCart,
  getCart,
  clearCart,
  updateQuantity,
};
