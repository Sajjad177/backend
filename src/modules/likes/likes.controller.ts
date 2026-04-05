import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import likesService from "./likes.service";

const toggleLikeForPost = catchAsync(async (req, res) => {
  const { email } = req.user;
  const { postId } = req.params;
  const result = await likesService.toggleLikeForPost(email, postId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ` You ${result.liked ? "liked" : "unliked"} a post.`,
    data: result,
  });
});

const toggleLikeForComment = catchAsync(async (req, res) => {
  const { email } = req.user;
  const { commentId } = req.params;
  const result = await likesService.toggleLikeForComment(
    email,
    commentId,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ` You ${result.liked ? "liked" : "unliked"} a comment.`,
    data: result,
  });
});

const toggleLikeForCommentReply = catchAsync(async (req, res) => {
  const { email } = req.user;
  const { replyCommentId } = req.params;
  const result = await likesService.toggleLikeForCommentReply(
    email,
    replyCommentId,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ` You ${result.liked ? "liked" : "unliked"} a reply comment.`,
    data: result,
  });
});

const getAllLikesByPost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const result = await likesService.getAllLikesByPost(postId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Post likes retrieved successfully",
    data: result,
  });
});

const getAllLikesByComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const result = await likesService.getAllLikesByComment(commentId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Comment likes retrieved successfully",
    data: result,
  });
});

const getAllLikesByReplyComment = catchAsync(async (req, res) => {
  const { replyCommentId } = req.params;
  const result = await likesService.getAllLikesByReplyComment(replyCommentId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reply comment likes retrieved successfully",
    data: result,
  });
});

const likesController = {
  toggleLikeForPost,
  getAllLikesByPost,
  toggleLikeForComment,
  toggleLikeForCommentReply,
  getAllLikesByComment,
  getAllLikesByReplyComment,
};

export default likesController;
