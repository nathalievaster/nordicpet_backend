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
  try {
    const { name, description, price, imageUrl, categoryId, quantity } = request.payload;

    if (!name || !price || !categoryId) {
      return h.response({ error: 'name, price och categoryId krävs' }).code(400);
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        categoryId,
        inventory: {
          create: {
            quantity: quantity ?? 0
          }
        }
      }
    });

    return h.response(product).code(201);
  } catch (err) {
    console.error(err);
    return h.response({ error: 'Kunde inte skapa produkt' }).code(400);
  }
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
