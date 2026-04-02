import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import replyCommentService from "./replyComment.service";

const addReplyComment = catchAsync(async (req, res) => {
  const { email } = req.user;
  const result = await replyCommentService.addReplyComment(email, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "New reply comment added successfully",
    data: result,
  });
});

const getAllReplyCommentByCommentId = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const result =
    await replyCommentService.getAllReplyCommentByCommentId(commentId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reply comments retrieved successfully",
    data: result,
  });
});

const replyCommentController = {
  addReplyComment,
  getAllReplyCommentByCommentId,
};

export default replyCommentController;
