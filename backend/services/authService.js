const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const logger = require("../utils/logger");

// REGISTER SERVICE
const registerUser = async ({ name, email, password }) => {
  logger.info(`User registered: ${email}`);
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    logger.warn(`Register failed: user already exists for email ${email}`);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign(
    { id: user.id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1d"}
  );

  return { token };
};

// LOGIN SERVICE
const loginUser = async ({ email, password }) => {
  logger.info(`User logged in: ${email}`);
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user){
    logger.warn(`Login failed: user not found for email ${email}`);
    throw new Error("Invalid credentials");
  } 

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch){
    logger.warn(`Login failed: invalid password for email ${email}`);
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { token };
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true, 
      products: {
        select: {
          id: true,
          title: true,
          price: true,
          image: true,
          category: true,
        },
      },
    },
  });

  if (!user){
    logger.warn(`GetMe failed: user not found for id ${userId}`);
    throw new Error("User not found");
  } 

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
