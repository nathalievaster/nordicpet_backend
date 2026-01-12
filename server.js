import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import { jwtPlugin } from './plugins/jwt.js';
import productRoutes from './routes/product.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import categoryRoutes from './routes/category.routes.js';
import inert from '@hapi/inert';
dotenv.config();

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: '0.0.0.0',
  routes: {
    cors: {
      origin: ['*']
    }
  }
});

const start = async () => {
    await server.register(jwtPlugin);
    await server.register(inert);

    // test route
    server.route({
        method: 'GET',
        path: '/',
        options: { auth: false },
        handler: () => ({ message: 'API is running' })
    });

    // auth routes
    server.route(authRoutes);

    // product routes
    server.route(productRoutes);

    // inventory routes
    server.route(inventoryRoutes);

    // category routes 
    server.route(categoryRoutes);

    server.route({
        method: 'GET',
        path: '/uploads/{param*}',
        options: { auth: false },
        handler: {
            directory: {
                path: 'uploads',
                redirectToSlash: true
            }
        }
    });

    // Startar server
    await server.start();
    console.log('Server running on', server.info.uri);
};

start();

console.log('Auth routes loaded:', authRoutes);