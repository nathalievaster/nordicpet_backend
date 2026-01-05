import prisma from '../prisma/client.js';

// Skapa kategori
export const createCategory = async (request, h) => {
  const { name, description } = request.payload;
  const category = await prisma.category.create({
    data: { name, description }
  });
  return h.response(category).code(201);
};

// Hämta alla kategorier
export const getCategories = async (request, h) => {
  const categories = await prisma.category.findMany({
    include: { products: true }
  });
  return categories;
};

// Hämta en kategori
export const getCategory = async (request, h) => {
  const id = Number(request.params.id);
  const category = await prisma.category.findUnique({
    where: { id },
    include: { products: true }
  });
  return category ? category : h.response({ error: 'Not found' }).code(404);
};

// Uppdatera kategori
export const updateCategory = async (request, h) => {
  const id = Number(request.params.id);
  const { name, description } = request.payload;

  const category = await prisma.category.update({
    where: { id },
    data: { name, description }
  });

  return category;
};

// Ta bort kategori
export const deleteCategory = async (request, h) => {
  const id = Number(request.params.id);

  await prisma.category.delete({ where: { id } });

  return { message: 'Category deleted' };
};
