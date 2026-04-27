const prisma = require("../config/prisma");

const createProduct = async (data, userId) => {
  return await prisma.product.create({
    data: {
      title: data.title,
      price: Number(data.price),
      description: data.description,
      category: data.category,
      image: data.image || null,
      user_id: userId,
    },
  });
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
    where: { id: Number(id) },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });
};

const updateProduct = async (id, data) => {
  const cleanData = {};

  if (data.title) cleanData.title = data.title;
  if (data.price) cleanData.price = Number(data.price);
  if (data.description) cleanData.description = data.description;
  if (data.category) cleanData.category = data.category;
  if (data.image) cleanData.image = data.image;

  return await prisma.product.update({
    where: { id: Number(id) },
    data: cleanData,
  });
};

const deleteProduct = async (id) => {
  return await prisma.product.delete({
    where: { id: Number(id) },
  });
};
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
