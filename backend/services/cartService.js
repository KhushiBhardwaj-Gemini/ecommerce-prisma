const prisma = require("../config/prisma");

//add to cart
const addToCart = async (userId, productId) => {
  //if product exists -check
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  //already in cart- check
  const existing = await prisma.cart.findUnique({
    where: {
      userId_productId: {
        userId: Number(userId),
        productId: Number(productId),
      },
    },
  });

  //handling quantity- if exists in cart
  if (existing) {
    return await prisma.cart.update({
      where: {
        userId_productId: {
          userId: Number(userId),
          productId: Number(productId),
        },
      },
      data: {
        quantity: existing.quantity + 1,
      },
    });
  }
  //if not exists, add to cart(create new)
  return await prisma.cart.create({
    data: {
      userId: Number(userId),
      productId: Number(productId),
      quantity: 1,
    },
  });
};

const getCart = async (userId) => {
  return await prisma.cart.findMany({
    where: {
      userId: Number(userId),
    },
    include: {
      product: true,
    },
  });
};

const clearCart = async (userId) => {
  return await prisma.cart.deleteMany({
    where: {
      userId: Number(userId),
    },
  });
};

const updateQuantity = async (userId, productId, type) => {
  const existing = await prisma.cart.findUnique({
    where: {
      userId_productId: {
        userId: Number(userId),
        productId: Number(productId),
      },
    },
  });

  if (!existing) {
    throw new Error("Item not in cart");
  }
  //decrease
  if (type === "decrease") {
    if (existing.quantity === 1) {
      //remove item from cart
      return await prisma.cart.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });
    }

    return await prisma.cart.update({
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
  return await prisma.cart.update({
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
};

module.exports = {
  addToCart,
  getCart,
  clearCart,
  updateQuantity,
};
