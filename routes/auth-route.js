import { login, register } from "../controllers/auth-controller.js";
import { loginRequest, registerRequest } from "../requests/auth-request.js";

export default (router) => {
  router.post("/auth/register", registerRequest, register);
  router.post("/auth/login", loginRequest, login);
};
