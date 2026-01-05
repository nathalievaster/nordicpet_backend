import { adjustInventory } from '../controllers/inventory.controller.js';
import { requireRole } from '../utils/requireRole.js';

export default [
  {
    method: 'PATCH',
    path: '/inventory/{productId}',
    handler: adjustInventory
  }
];
