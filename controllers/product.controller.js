import prisma from '../prisma/client.js';

export const getAllProducts = async () => {
  return prisma.product.findMany({
    include: {
      category: true,
      inventory: true
    }
  });
};

export const getProductById = async (request, h) => {
  const id = Number(request.params.id);

  const product = await prisma.product.findUnique({
    where: { id },
    include: { inventory: true, category: true }
  });

  if (!product) {
    return h.response({ error: 'Product not found' }).code(404);
  }

  return product;
};

export const createProduct = async (request, h) => {
  const { name, description, price, imageUrl, categoryId, quantity } = request.payload;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      imageUrl,
      categoryId,
      inventory: {
        create: {
          quantity
        }
      }
    }
  });

  return h.response(product).code(201);
};

export const updateProduct = async (request, h) => {
  const id = Number(request.params.id);

  const product = await prisma.product.update({
    where: { id },
    data: request.payload
  });

  return product;
};

export const deleteProduct = async (request, h) => {
  const id = Number(request.params.id);

  await prisma.product.delete({ where: { id } });

  return h.response().code(204);
};
