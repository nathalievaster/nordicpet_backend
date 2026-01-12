import prisma from '../prisma/client.js';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { createProductSchema } from '../validators/product.validators.js';
import { updateProductSchema } from '../validators/updateProduct.validator.js';

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
    // Plocka ut bilden separat eftersom den är en stream och inte ska valideras med Joi
    const { image, ...rest } = request.payload;

    // Validera och konvertera alla text-/nummerfält med Joi
    const { error, value } = createProductSchema.validate(rest, {
      abortEarly: false,
      convert: true,
      stripUnknown: true // Tar bort oväntade fält (t.ex. imageUrl från frontend)
    });

    // Returnera tydliga valideringsfel om något är ogiltigt
    if (error) {
      return h
        .response({
          error: 'Validation error',
          details: error.details.map(d => d.message)
        })
        .code(400);
    }

    const { name, description, price, categoryId, quantity } = value;

    let imageUrl = null;

    // Hantera filuppladdning manuellt (Hapi stream)
    if (image && image.hapi?.filename) {
      // Kontrollera att filen faktiskt är en bild
      if (!image.hapi.headers['content-type']?.startsWith('image/')) {
        return h
          .response({ error: 'Endast bildfiler är tillåtna' })
          .code(400);
      }

      // Tillåt endast vissa filändelser
      const ext = path.extname(image.hapi.filename).toLowerCase();
      const allowedExt = ['.jpg', '.jpeg', '.png', '.webp'];

      if (!allowedExt.includes(ext)) {
        return h
          .response({ error: 'Ogiltigt bildformat' })
          .code(400);
      }

      // Skapa unikt filnamn och spara bilden till uploads-mappen
      const filename = `${Date.now()}${ext}`;
      const uploadPath = path.join('uploads', filename);

      await pipeline(
        image,
        fs.createWriteStream(uploadPath)
      );

      // Spara sökvägen till bilden i databasen
      imageUrl = `/uploads/${filename}`;
    }

    // Skapa produkten i databasen
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        imageUrl,
        inventory: {
          create: {
            quantity: quantity ?? 0
          }
        }
      }
    });

    return h.response(product).code(201);
  } catch (err) {
    // Fångar oväntade fel (t.ex. filsystem, databas, etc.)
    console.error('CREATE PRODUCT ERROR:', err);

    return h
      .response({ error: 'Kunde inte skapa produkt' })
      .code(400);
  }
};

export const updateProduct = async (request, h) => {
  console.log('UPDATE PRODUCT HIT', request.params.id);
  try {
    const id = Number(request.params.id);

    // Hämta befintlig produkt (behövs bl.a. för gammal bild)
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { inventory: true }
    });

    if (!existingProduct) {
      return h
        .response({ error: 'Produkt hittades inte' })
        .code(404);
    }

    // Plocka ut bilden separat (stream → ska inte Joi-valideras)
    const { image, ...rest } = request.payload;

    // Validera och sanera övriga fält
    const { error, value } = updateProductSchema.validate(rest, {
      abortEarly: false,
      convert: true,
      stripUnknown: true
    });

    if (error) {
      return h
        .response({
          error: 'Validation error',
          details: error.details.map(d => d.message)
        })
        .code(400);
    }

    const { quantity, ...productData } = value;

    let imageUrl = existingProduct.imageUrl;

    // Om ny bild skickats → validera och spara den
    if (image && image.hapi?.filename) {
      // Kontrollera MIME-typ
      if (!image.hapi.headers['content-type']?.startsWith('image/')) {
        return h
          .response({ error: 'Endast bildfiler är tillåtna' })
          .code(400);
      }

      // Tillåt endast vissa filformat
      const ext = path.extname(image.hapi.filename).toLowerCase();
      const allowedExt = ['.jpg', '.jpeg', '.png', '.webp'];

      if (!allowedExt.includes(ext)) {
        return h
          .response({ error: 'Ogiltigt bildformat' })
          .code(400);
      }

      // Spara ny bild
      const filename = `${Date.now()}${ext}`;
      const uploadPath = path.join('uploads', filename);

      await pipeline(
        image,
        fs.createWriteStream(uploadPath)
      );

      imageUrl = `/uploads/${filename}`;

      // Ta bort gammal bild (om den finns)
      if (existingProduct.imageUrl) {
        const oldPath = path.join(
          'uploads',
          path.basename(existingProduct.imageUrl)
        );

        fs.unlink(oldPath, () => {
          // Ignorerar fel (t.ex. om filen redan saknas)
        });
      }
    }

    // Uppdatera produkt + inventory (om quantity skickats)
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        imageUrl,
        ...(quantity !== undefined && {
          inventory: {
            upsert: {
              create: { quantity },
              update: { quantity }
            }
          }
        })
      },
      include: {
        inventory: true,
        category: true
      }
    });

    return h.response(updatedProduct).code(200);
  } catch (err) {
    console.error('UPDATE PRODUCT ERROR:', err);
    return h
      .response({ error: 'Kunde inte uppdatera produkt' })
      .code(500);
  }
};


export const deleteProduct = async (request, h) => {
  const id = Number(request.params.id);

  await prisma.inventory.deleteMany({
    where: { productId: id }
  });

  await prisma.product.delete({
    where: { id }
  });

  return h.response().code(204);
};
