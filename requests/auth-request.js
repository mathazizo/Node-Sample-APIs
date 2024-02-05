import { validate } from "./index.js";

export const registerRequest = (req, res, next) => {
  return validate(req, res, next, {
    username: "required",
    email: "required",
    password: "required",
  });
};

export const loginRequest = (req, res, next) => {
  return validate(req, res, next, {
    email: "required",
    password: "required",
  });
}
