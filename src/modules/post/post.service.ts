import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { User } from "../user/user.model";
import { IPost } from "./post.interface";
import Post from "./post.model";

const createNewPost = async (
  email: string,
  files: Express.Multer.File[],
  payload: IPost,
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      "Your account is not found. Please sign up to create a post.",
      StatusCodes.NOT_FOUND,
    );
  }

  const uploadedImages: { url: string; public_id: string }[] = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const uploaded = await uploadToCloudinary(file.path, "products");
      uploadedImages.push({
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      });
    }
  }

  const result = await Post.create({
    authorId: user._id,
    text: payload.text,
    images: uploadedImages,
  });
  return result;
};

const getAllPosts = () => {
  // Logic to retrieve all posts
};

const getPostById = (postId: string) => {
  // Logic to retrieve a post by its ID
};

const updatePostById = (postId: string, updatedData: any) => {
  // Logic to update a post by its ID
};

const deletePostById = (postId: string) => {
  // Logic to delete a post by its ID
};

const postService = {
  createNewPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
};

export default postService;
