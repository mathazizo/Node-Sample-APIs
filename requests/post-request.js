import { validate } from "./index.js";

export const createPostRequest = (req, res, next) => {
  return validate(req, res, next, {
    userId: "required",
    desc: "string|max:500",
    img: "string",
  });
};

export const getPostTimelineRequest = (req, res, next) => {
  return validate(req, res, next, {
    userId: "required",
  });
};

export const updatePostRequest = (req, res, next) => {
  return validate(req, res, next, {
    userId: "required",
    desc: "string|max:500",
    img: "string",
  });
};

export const likePostRequest = (req, res, next) => {
  return validate(req, res, next, {
    userId: "required",
  });
};

export const deletePostRequest = (req, res, next) => {
  return validate(req, res, next, {
    userId: "required",
  });
};
