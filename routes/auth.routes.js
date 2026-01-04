import { register, login } from '../controllers/auth.controller.js';

export default [
  {
    method: 'POST',
    path: '/auth/register',
    options: {
      auth: false,
      handler: register
    }
  },
  {
    method: 'POST',
    path: '/auth/login',
    options: {
      auth: false,
      handler: login
    }
  }
];