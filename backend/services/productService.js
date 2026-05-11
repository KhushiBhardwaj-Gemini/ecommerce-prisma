const prisma = require("../config/prisma");
const logger = require("../utils/logger");
const { logAction } = require("./auditService");

const createProduct = async (data, userId) => {
  const product =  await prisma.product.create({
    data: {
      title: data.title,
      price: Number(data.price),
      description: data.description,
      category: data.category,
      image: data.image || null,
      user_id: userId,
    },
  });
  logger.info(`Product created: ${data.title} by user ${userId}`);
  await logAction({
    userId,
    action: "CREATE",
    entity: "PRODUCT",
    entityId: product.id,
  });

  return product;
};

const getProducts = async ({
  search,
  category,
  sort,
  page = 1,
  limit = 15,
}) => {
  const where = {
    is_active: true,
  };

  // SEARCH
  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  //  CATEGORY
  if (category) {
    where.category = category;
  }

  const products = await prisma.product.findMany({
    where,

    include: {
      user: {
        select: { name: true },
      },
    },

    orderBy:
      sort === "low"
        ? { price: "asc" }
        : sort === "high"
          ? { price: "desc" }
          : { id: "desc" },

    skip: (page - 1) * limit,
    take: Number(limit),
  });

  const total = await prisma.product.count({ where });

  return {
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
};

const getProductById = async (id) => {
  return await prisma.product.findUnique({
    where: { id: id },
    include: {
      user: {
        select: { name: true, email: true },
      },

      cart: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

const updateProduct = async (id, data, user) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) {
    logger.warn(`Product not found: ${id}`);
    throw new Error("Product not found");
  }
  //ownership check
  if (user.role === "SELLER" && product.user_id !== user.id) {
    logger.warn(`Unauthorized attempt to update product: ${id}`);
    throw new Error("Not authorized to update this product");
  }

  const cleanData = {};

  if (data.title) cleanData.title = data.title;
  if (data.price) cleanData.price = Number(data.price);
  if (data.description) cleanData.description = data.description;
  if (data.category) cleanData.category = data.category;
  if (data.image) cleanData.image = data.image;

  const updatedProduct = await prisma.product.update({
    where: { id: id },
    data: cleanData,
  });

  logger.info(`Product updated: ${id} by user ${user.id}`);
  await logAction({
    userId: user.id,
    action: "UPDATE",
    entity: "PRODUCT",
    entityId: id,
  });

  return updatedProduct;
};

const deleteProduct = async (id, user) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) {
    logger.warn(`Product not found: ${id}`);
    throw new Error("Product not found");
  }
  //ownership check
  if (user.role === "SELLER" && product.user_id !== user.id) {
    logger.warn(`Unauthorized attempt to delete product: ${id}`);
    throw new Error("Not authorized to delete this product");
  }
  await prisma.product.delete({
    where: { id: id },
  });
  logger.info(`Product deleted: ${id} by user ${user.id}`);
  await logAction({
    userId: user.id,
    action: "DELETE",
    entity: "PRODUCT",
    entityId: id,
  });

  return {message: "Product Deleted"};
};
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
