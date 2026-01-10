import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';
import { requireRole } from '../utils/requireRole.js';

export default [
  {
    method: 'POST',
    path: '/categories',
    options: {
      auth: 'jwt',
      pre: [requireRole(['admin'])]
    },
    handler: createCategory
  },
  {
    method: 'GET',
    path: '/categories',
    options: { auth: false },
    handler: getCategories
  },
  {
    method: 'GET',
    path: '/categories/{id}',
    options: { auth: false },
    handler: getCategory
  },
  {
    method: 'PATCH',
    path: '/categories/{id}',
    options: {
      auth: 'jwt',
      pre: [requireRole(['admin'])]
    },
    handler: updateCategory
  },
  {
    method: 'DELETE',
    path: '/categories/{id}',
    options: {
      auth: 'jwt',
      pre: [requireRole(['admin'])]
    },
    handler: deleteCategory
  }
];
