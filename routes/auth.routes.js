import { register, login } from '../controllers/auth.controller.js';
import { registerSchema, loginSchema } from '../validators/auth.validators.js';


export default [
    {
        method: 'POST',
        path: '/auth/register',
        options: {
            auth: false,
            validate: {
                payload: registerSchema,
                options: {
                    abortEarly: false
                },
                failAction: (request, h, error) => {
                    return h
                        .response({
                            message: 'Validation error',
                            details: error.details.map(d => d.message)
                        })
                        .code(400)
                        .takeover();
                }
            }
        },
        handler: register
    },
    {
        method: 'POST',
        path: '/auth/login',
        options: {
            auth: false,
            validate: {
                payload: loginSchema,
                options: {
                    abortEarly: false
                },
                failAction: (request, h, error) => {
                    return h
                        .response({
                            message: 'Validation error',
                            details: error.details.map(d => d.message)
                        })
                        .code(400)
                        .takeover();
                }
            }
        },
        handler: login
    }
];