import { User } from "../models/user-model.js";
import { hashPassword, responseError, responseSuccess } from "../helpers/index.js";

export const updateUser = async (req, res, next) => {
  try {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        req.body.password =  hashPassword(req.body.password);
      }
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      console.log(user);
      if(!user) return res.status(404).json(responseError("user not found"));
      return res
        .status(200)
        .json(responseSuccess("account has been updated", user));
    } else {
      return res
        .status(403)
        .json(responseError("you can update only your account"));
    }
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json(responseError("user not found"));
    return res
      .status(200)
      .json(responseSuccess("get user by id success", user));
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json(responseError("user not found"));
      return res
        .status(200)
        .json(responseSuccess("account has been deleted", null));
    } else {
      return res
        .status(403)
        .json(responseError("you can delete only your account"));
    }
  } catch (err) {
    next(err);
  }
};

export const followUser = async (req, res, next) => {
  try {
    if (req.body.userId !== req.params.id) {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json(responseError("target user not found"));
      const currentUser = await User.findById(req.body.userId);
      if (!currentUser)
        return res.status(404).json(responseError("current user not found"));
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        return res.status(200).json(responseSuccess("user has been followed"));
      } else {
        return res
          .status(403)
          .json(responseError("you already follow this user"));
      }
    } else {
      return res.status(403).json(responseError("you cant follow yourself"));
    }
  } catch (err) {
    next(err);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    if (req.body.userId !== req.params.id) {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json(responseError("user not found"));
      const currentUser = await User.findById(req.body.userId);
      if (!currentUser)
        return res.status(404).json(responseError("current user not found"));
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        return res
          .status(200)
          .json(responseSuccess("user has been unfollowed", null));
      } else {
        return res.status(403).json(responseError("you dont follow this user"));
      }
    } else {
      return res.status(403).json(responseError("you cant unfollow yourself"));
    }
  } catch (err) {
    next(err);
  }
};
