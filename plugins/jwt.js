import Jwt from '@hapi/jwt';

export const jwtPlugin = {
  name: 'jwt-auth',
  register: async (server) => {
    await server.register(Jwt);

    server.auth.strategy('jwt', 'jwt', {
      keys: process.env.JWT_SECRET,
      verify: {
        aud: false,
        iss: false,
        sub: false
      },
      validate: (artifacts) => {
        return {
          isValid: true,
          credentials: artifacts.decoded.payload
        };
      }
    });

    server.auth.default('jwt');
  }
};
