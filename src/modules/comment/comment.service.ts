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

  await Post.findByIdAndUpdate(isPostExist._id, {
    $inc: { totalComments: 1 },
  });

  return result;
};

const getAllComments = async (query: any) => {
  const limit = parseInt(query.limit) || 10;
  const cursor = query.cursor;

  if (cursor) {
    query._id = { $lt: cursor };
  }

  const comments = await Comment.find(query)
    .populate([
      {
        path: "userId",
        select: "firstName lastName avatar",
      },
      {
        path: "postId",
        select: "_id text",
      },
    ])
    .sort({ _id: -1 })
    .limit(limit + 1);

  let nextCursor: string | undefined = undefined;
  if (comments.length > limit) {
    const nextItem = comments.pop();
    nextCursor = nextItem?._id.toString();
  }

  return {
    data: comments,
    nextCursor,
  };
};

const getCommentByPostId = async (postId: string, query: any) => {
  const limit = parseInt(query.limit) || 10;
  const cursor = query.cursor;

  if (cursor) {
    query._id = { $lt: cursor };
  }

  const comments = await Comment.find({ postId })
    .populate([
      {
        path: "userId",
        select: "firstName lastName avatar",
      },
      {
        path: "postId",
        select: "_id text",
      },
    ])
    .sort({ _id: -1 })
    .limit(limit + 1);

  let nextCursor: string | undefined = undefined;
  if (comments.length > limit) {
    const nextItem = comments.pop();
    nextCursor = nextItem?._id.toString();
  }

  return {
    data: comments,
    nextCursor,
  };
};

const commentService = {
  createComment,
  getAllComments,
  getCommentByPostId,
};

export default commentService;
