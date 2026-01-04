import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import { jwtPlugin } from './plugins/jwt.js';

dotenv.config();

const server = Hapi.server({
  port: 3000,
  host: 'localhost',
  routes: {
    cors: {
      origin: ['*']
    }
  }
});

const start = async () => {
  await server.register(jwtPlugin);

  // test route
  server.route({
    method: 'GET',
    path: '/',
    options: { auth: false },
    handler: () => ({ message: 'API is running' })
  });

  // auth routes
  server.route(authRoutes);

  // start server
  await server.start();
  console.log('Server running on', server.info.uri);
};

start();