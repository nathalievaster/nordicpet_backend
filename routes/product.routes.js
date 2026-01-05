import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';

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
    handler: createProduct
  },
  {
    method: 'PUT',
    path: '/products/{id}',
    handler: updateProduct
  },
  {
    method: 'DELETE',
    path: '/products/{id}',
    handler: deleteProduct
  }
];
