import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import Post from "../post/post.model";
import { User } from "../user/user.model";
import Likes from "./likes.model";

const toggleLikeForPost = async (email: string, postId: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", StatusCodes.NOT_FOUND);
  }

  const existingLike = await Likes.findOne({
    userId: user._id, // should match your LikesSchema
    targetId: postId,
    targetType: "Post",
  });

  if (existingLike) {
    await Likes.findByIdAndDelete(existingLike._id);

    // decrement likeCount
    await Post.findByIdAndUpdate(postId, { $inc: { totalLikes: -1 } });

    return { liked: false };
  } else {
    await Likes.create({
      userId: user._id,
      targetId: postId,
      targetType: "Post",
    });

    // increment likeCount
    await Post.findByIdAndUpdate(postId, { $inc: { totalLikes: 1 } });

    return { liked: true };
  }
};

const getAllLikesByPost = async (postId: string) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", StatusCodes.NOT_FOUND);
  }

  const likes = await Likes.find({
    targetId: postId,
    targetType: "Post",
  }).populate("userId", "firstName lastName");

  return likes;
};

const likesService = {
  toggleLikeForPost,
  getAllLikesByPost,
};

export default likesService;
