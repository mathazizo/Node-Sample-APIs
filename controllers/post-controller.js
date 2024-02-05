import { Post } from "../models/post-model.js";
import { User } from "../models/user-model.js";
import { responseError, responseSuccess } from "../helpers/index.js";

export const createPost = async (req, res, next) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    return res
      .status(200)
      .json(responseSuccess("create post success", savedPost));
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json(responseError("post not found"));
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      return res
        .status(200)
        .json(responseSuccess("post has been updated", null));
    } else {
      return res
        .status(403)
        .json(responseError("you can update only your post"));
    }
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json(responseError("post not found"));
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res
        .status(200)
        .json(responseSuccess("post has been deleted", null));
    } else {
      return res
        .status(403)
        .json(responseError("you can delete only your post"));
    }
  } catch (err) {
    next(err);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json(responseError("post not found"));
    return res
      .status(200)
      .json(responseSuccess("get post by id success", post));
  } catch (err) {
    next(err);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json(responseError("post not found"));
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      return res.status(200).json(responseSuccess("post has been liked", null));
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      return res
        .status(200)
        .json(responseSuccess("post has been disliked", null));
    }
  } catch (err) {
    next(err);
  }
};

export const getPostTimeline = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    if (!currentUser)
      return res.status(404).json(responseError("current user not found"));
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      }),
    );
    return res
      .status(200)
      .json(
        responseSuccess(
          "get post timelines success",
          userPosts.concat(...friendPosts),
        ),
      );
  } catch (err) {
    next(err);
  }
};
