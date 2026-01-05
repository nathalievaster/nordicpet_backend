import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().min(5).required(),
  price: Joi.number().positive().required(),
  imageUrl: Joi.string().required(),
  categoryId: Joi.number().integer().required()
});
