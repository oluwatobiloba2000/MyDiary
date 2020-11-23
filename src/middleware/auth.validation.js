/* eslint-disable max-len */
import Joi from 'joi';

const validate = {
  login: (username, password) => {
    const JoiSchema = Joi.object({
      username: Joi.string().min(3).required(),
      password: Joi.string().min(5).required(),
    });

    return JoiSchema.validate({ username, password });
  },

  signup: (username, password, firstname, lastname, email) => {
    const JoiSchema = Joi.object({
      username: Joi.string().min(3).required(),
      password: Joi.string().min(5).required(),
      firstname: Joi.string().min(3).required(),
      lastname: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
    });

    return JoiSchema.validate({
      username, password, firstname, lastname, email,
    });
  },
};

export default validate;
