import Joi from 'joi';

export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  description: Joi.string().min(5).optional(),
  price: Joi.number().positive().optional(),
  categoryId: Joi.number().integer().optional(),
  quantity: Joi.number().integer().min(0).optional()
});