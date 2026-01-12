import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';

import { requireRole } from '../utils/requireRole.js';

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
            payload: {
                output: 'stream',
                parse: true,
                multipart: true,
                maxBytes: 10 * 1024 * 1024
            }
        },
        handler: createProduct
    },
    {
        method: 'PUT',
        path: '/products/{id}',
        options: {
            pre: [requireRole(['admin'])],
            payload: {
                output: 'stream',
                parse: true,
                multipart: true,
                maxBytes: 10 * 1024 * 1024
            }
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
