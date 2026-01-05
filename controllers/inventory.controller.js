import prisma from '../prisma/client.js';

// Skapar och exporterar en funktion för att justera lagersaldo för en produkt
export const adjustInventory = async (request, h) => {
    try {
        // Hämtar produkt-ID från URL-parametrar och konverterar till nummer
        const productId = Number(request.params.productId);
        // Hämtar ändringen i lagersaldo från request payload
        const { change } = request.payload; // t.ex. +5 eller -3

        if (!Number.isInteger(productId)) {
            return h.response({ error: 'Invalid product ID' }).code(400);
        }

        if (typeof change !== 'number' || change === 0) {
            return h.response({ error: 'Change must be a non-zero number' }).code(400);
        }
        // Hämtar nuvarande lagersaldo för produkten från databasen
        const inventory = await prisma.inventory.findUnique({
            where: { productId }
        });

        if (!inventory) {
            return h.response({ error: 'Inventory not found' }).code(404);
        }

        const updatedInventory = await prisma.inventory.update({
            where: { productId },
            data: {
                quantity: inventory.quantity + change
            }
        });

        return {
            message: 'Inventory updated',
            inventory: updatedInventory
        }
    } catch (err) {
        console.error(err);
        return h.response({ error: 'Internal server error' }).code(500);
    }
};
