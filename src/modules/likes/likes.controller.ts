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
    message: `Post has been ${result.liked ? "liked" : "unliked"} successfully.`,
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

const likesController = {
  toggleLikeForPost,
  getAllLikesByPost,
};

export default likesController;
