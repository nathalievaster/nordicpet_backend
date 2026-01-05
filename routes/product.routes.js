import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';

import { requireRole } from '../utils/requireRole.js';
import { createProductSchema } from '../validators/product.validators.js';

export default [
    {
        method: 'GET',
        path: '/products',
        handler: getAllProducts
    },
    {
        method: 'GET',
        path: '/products/{id}',
        handler: getProductById
    },
    {
        method: 'POST',
        path: '/products',
        options: {
            pre: [requireRole(['admin'])],
            validate: {
                payload: createProductSchema,
                options: {
                    abortEarly: false
                },
                failAction: (request, h, err) => {
                    return h
                        .response({
                            error: 'Validation error',
                            details: err.details.map(d => d.message)
                        })
                        .code(400)
                        .takeover();
                }
            }
        },
        handler: createProduct
    },
    {
        method: 'PUT',
        path: '/products/{id}',
        options: {
            pre: [requireRole(['admin'])],
        },
        handler: updateProduct
    },
    {
        method: 'DELETE',
        path: '/products/{id}',
        options: {
            pre: [requireRole(['admin'])]
        },
        handler: deleteProduct
    }
];
