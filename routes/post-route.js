import {
  createPost,
  deletePost,
  getPostById,
  getPostTimeline,
  likePost,
  updatePost,
} from "../controllers/post-controller.js";
import {
  createPostRequest,
  deletePostRequest,
  getPostTimelineRequest,
  likePostRequest,
  updatePostRequest,
} from "../requests/post-request.js";

export default (router) => {
  router.get("/posts/timelines", getPostTimelineRequest, getPostTimeline);
  router.get("/posts/:id", getPostById);
  router.post("/posts", createPostRequest, createPost);
  router.put("/posts/:id", updatePostRequest, updatePost);
  router.put("/posts/:id/likes", likePostRequest, likePost);
  router.delete("/posts/:id", deletePostRequest, deletePost);
};
