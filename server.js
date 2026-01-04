import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';

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
  await server.start();
  console.log('Server running on', server.info.uri);
};

server.route(authRoutes);
start();