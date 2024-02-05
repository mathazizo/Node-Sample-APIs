import validator from "validatorjs";
import { responseError } from "../helpers/index.js";
import _ from "lodash";

export const validate = (req, res, next, rules) => {
  const validation = new validator(req.body, rules);
  if (validation.fails()) {
    const errors = {};
    _.each(validation.errors.errors, (error, key) => {
      errors[key] = error[0];
    });
    return res.status(400).json(responseError("validation error", errors));
  }
  next();
};
