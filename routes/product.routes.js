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
        options: {
            pre: [requireRole(['admin', 'lager'])]
        },
        handler: getAllProducts
    },
    {
        method: 'GET',
        path: '/products/{id}',
        options: {
            pre: [requireRole(['admin', 'lager'])]
        },
        handler: getProductById
    },
    {
        method: 'POST',
        path: '/products',
        options: {
            pre: [requireRole('admin')]
        },
        handler: createProduct
    },
    {
        method: 'PUT',
        path: '/products/{id}',
        options: {
            pre: [requireRole(['admin', 'lager'])]
        },
        handler: updateProduct
    },
    {
        method: 'DELETE',
        path: '/products/{id}',
        options: {
            pre: [requireRole(['admin', 'lager'])]
        },
        handler: deleteProduct
    }
];
