const Joi = require("joi");

const registerAndLoginSchema = Joi.object({
  email: Joi.string().email().min(6).required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  registerAndLoginSchema,
};
