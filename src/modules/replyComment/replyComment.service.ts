import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import Comment from "../comment/comment.model";
import { User } from "../user/user.model";
import { IReplyComment } from "./replyComment.interface";
import ReplyComment from "./replyComment.model";

const addReplyComment = async (email: string, payload: IReplyComment) => {
  const { commentId, text } = payload;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      "Your account is not found. Please sign up to create a post.",
      StatusCodes.NOT_FOUND,
    );
  }


  const isCommentExist = await Comment.findById(commentId);
  if (!isCommentExist) {
    throw new AppError("Comment not found", StatusCodes.NOT_FOUND);
  }


  const result = await ReplyComment.create({
    commentId,
    text,
    userId: user._id,
  });


  await Comment.findByIdAndUpdate(commentId, {
    $inc: { replyCount: 1 },
  });

  return result;
};

const getAllReplyCommentByCommentId = async (commentId: string) => {
  const isExist = await Comment.findById(commentId);
  if (!isExist) {
    throw new AppError("Comment not found", StatusCodes.NOT_FOUND);
  }

  const result = await ReplyComment.find({ commentId }).populate([
    {
      path: "userId",
      select: "firstName lastName",
    },
  ]);

  return result;
};

const replyCommentService = {
  addReplyComment,
  getAllReplyCommentByCommentId,
};

export default replyCommentService;
