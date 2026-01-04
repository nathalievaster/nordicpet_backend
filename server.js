import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';

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

start();