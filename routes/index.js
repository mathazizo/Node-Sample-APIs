import express from "express";
import userRoute from "./user-route.js";
import postRoute from "./post-route.js";
import authRoute from "./auth-route.js";

const router = express.Router()

export default () => {
  userRoute(router);
  postRoute(router);
  authRoute(router);
  return router;
};
