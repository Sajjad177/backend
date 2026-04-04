import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import Comment from "../comment/comment.model";
import Post from "../post/post.model";
import { User } from "../user/user.model";
import { IReplyComment } from "./replyComment.interface";
import ReplyComment from "./replyComment.model";

const addReplyComment = async (email: string, payload: IReplyComment) => {
  const { commentId, postId, text } = payload;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      "Your account is not found. Please sign up to create a post.",
      StatusCodes.NOT_FOUND,
    );
  }

  const isPostExist = await Comment.findById(commentId);
  if (!isPostExist) {
    throw new AppError("Post not found", StatusCodes.NOT_FOUND);
  }

  const isCommentExist = await Comment.findById(commentId);
  if (!isCommentExist) {
    throw new AppError("Comment not found", StatusCodes.NOT_FOUND);
  }

  const result = await ReplyComment.create({
    commentId,
    postId,
    text,
    userId: user._id,
  });

  await Post.findByIdAndUpdate(postId, {
    $inc: { totalComments: 1 },
  });

  return result;
};

const getAllReplyCommentByCommentId = async (commentId: string, query: any) => {
  const limit = parseInt(query.limit) || 10;
  const cursor = query.cursor;

  const isExist = await Comment.findById(commentId);
  if (!isExist) {
    throw new AppError("Comment not found", StatusCodes.NOT_FOUND);
  }

  const filter: any = { commentId };

  if (cursor) {
    filter._id = { $lt: cursor };
  }

  const result = await ReplyComment.find(filter)
    .sort({ _id: -1 })
    .limit(limit)
    .populate({
      path: "userId",
      select: "firstName lastName avatar",
    });

  const nextCursor =
    result.length === limit ? result[result.length - 1]._id : null;

  return {
    data: result,
    nextCursor,
  };
};

const replyCommentService = {
  addReplyComment,
  getAllReplyCommentByCommentId,
};

export default replyCommentService;
