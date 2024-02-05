import { validate } from "./index.js";

export const updateUserRequest = (req, res, next) => {
  return validate(req, res, next, {
    userId: "required",
    username: "string|min:4|max:20",
    email: "email",
    password: "min:6",
    profilePicture: "string",
    coverPicture: "string",
    desc: "string|max:50",
    city: "string|max:50",
    from: "string|max:50",
    relationship: "number",
  });
};

export const deleteUserRequest = (req, res, next) => {
  return validate(req, res, next, {
    userId: "required",
  });
};

export const followUserRequest = (req, res, next) => {
  return validate(req, res, next, {
    userId: "required",
  });
};

export const unfollowUserRequest = (req, res, next) => {
  return validate(req, res, next, {
    userId: "required",
  });
};
