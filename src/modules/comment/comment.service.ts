import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import Post from "../post/post.model";
import { User } from "../user/user.model";
import { IComment } from "./comment.interface";
import Comment from "./comment.model";

const createComment = async (email: string, payload: IComment) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      "Your account is not found. Please sign up to create a post.",
      StatusCodes.NOT_FOUND,
    );
  }

  const isPostExist = await Post.findById(payload.postId);
  if (!isPostExist) {
    throw new AppError("Post not found", StatusCodes.NOT_FOUND);
  }

  const result = await Comment.create({
    ...payload,
    userId: user._id,
  });

  await Post.findByIdAndUpdate(payload.postId, {
    $inc: { totalComments: 1 },
  });

  return result;
};

const getAllComments = async () => {
  const isExist = await Comment.find();
  if (!isExist) {
    throw new AppError("Comments not found", StatusCodes.NOT_FOUND);
  }

  const result = await Comment.find().populate([
    {
      path: "userId",
      select: "firstName lastName",
    },
    {
      path: "postId",
    },
  ]);
  return result;
};

const commentService = {
  createComment,
  getAllComments,
};

export default commentService;
