import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().min(2).required(),
  price: Joi.number().positive().required(),
  categoryId: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(0).optional()
});