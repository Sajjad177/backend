import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import postService from "./post.service";

const createNewPost = catchAsync(async (req, res) => {
  const { email } = req.user;
  const files = req.files as Express.Multer.File[];
  const result = await postService.createNewPost(email, files, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "New post created successfully",
    data: result,
  });
});

const getAllPosts = catchAsync(async (req, res) => {
  const result = await postService.getAllPosts();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Posts retrieved successfully",
    data: result,
  });
});

const getPostById = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const result = await postService.getPostById(postId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Post retrieved successfully",
    data: result,
  });
});

const updatePostById = catchAsync(async (req, res) => {
  const { email } = req.user;
  const { postId } = req.params;
  const files = req.files as Express.Multer.File[];

  const result = await postService.updatePostById(postId, req.body, files, email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Post updated successfully",
    data: result,
  });
});

const deletePostById = catchAsync(async (req, res) => {
  const { email } = req.user;
  const { postId } = req.params;
  const result = await postService.deletePostById(postId, email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Post deleted successfully",
    data: result,
  });
});

const postController = {
  createNewPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
};

export default postController;
