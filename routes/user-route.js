import {
  deleteUser,
  followUser,
  getUserById,
  unfollowUser,
  updateUser,
} from "../controllers/user-controller.js";
import {
  deleteUserRequest,
  followUserRequest,
  unfollowUserRequest,
  updateUserRequest
} from "../requests/user-request.js";

export default (router) => {
  router.get("/users/:id", getUserById);
  router.put("/users/:id", updateUserRequest, updateUser);
  router.put("/users/:id/follows", followUserRequest, followUser);
  router.put("/users/:id/unfollows", unfollowUserRequest, unfollowUser);
  router.delete("/users/:id", deleteUserRequest, deleteUser);
};
