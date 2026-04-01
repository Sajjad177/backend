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

const getAllPosts = catchAsync(async (req, res) => {});

const getPostById = catchAsync(async (req, res) => {});

const updatePostById = catchAsync(async (req, res) => {});

const deletePostById = catchAsync(async (req, res) => {});

const postController = {
  createNewPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
};

export default postController;
