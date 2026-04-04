import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import commentService from "./comment.service";

const createComment = catchAsync(async (req, res) => {
  const { email } = req.user;
  const result = await commentService.createComment(email, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "New comment added successfully",
    data: result,
  });
});

const getAllComments = catchAsync(async (req, res) => {
  const result = await commentService.getAllComments(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Comments retrieved successfully",
    data: result.data,
    meta: {
      nextCursor: result.nextCursor,
    },
  });
});

const getCommentByPostId = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const result = await commentService.getCommentByPostId(postId, req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Comments retrieved successfully",
    data: result.data,
    meta: {
      nextCursor: result.nextCursor,
    },
  });
});

const commentController = {
  createComment,
  getAllComments,
  getCommentByPostId,
};

export default commentController;
