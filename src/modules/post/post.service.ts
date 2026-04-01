import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary";
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
  const result = Post.find().populate("authorId", "firstName lastName");
  return result;
};

const getPostById = (postId: string) => {
  const isExist = Post.findById(postId);
  if (!isExist) {
    throw new AppError("Post not found", StatusCodes.NOT_FOUND);
  }

  const result = Post.findById(postId).populate(
    "authorId",
    "firstName lastName",
  );
  return result;
};

const updatePostById = async (
  postId: string,
  payload: Partial<IPost>,
  files?: Express.Multer.File[],
) => {
  // 🔹 Check if post exists
  const isExist = await Post.findById(postId);

  if (!isExist) {
    throw new AppError("Post not found", StatusCodes.NOT_FOUND);
  }

  let uploadedImages = isExist.images || [];

  // 🔹 If new images uploaded
  if (files && files.length > 0) {
    // delete old images from cloudinary
    for (const img of isExist.images || []) {
      await deleteFromCloudinary(img.public_id);
    }

    uploadedImages = [];

    // upload new images
    for (const file of files) {
      const uploaded = await uploadToCloudinary(file.path, "posts");

      uploadedImages.push({
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      });
    }
  }

  // 🔹 Update post
  const result = await Post.findByIdAndUpdate(
    postId,
    {
      ...(payload.text && { text: payload.text }),
      ...(files && files.length > 0 && { images: uploadedImages }),
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

const deletePostById = async (postId: string) => {
  // 🔹 Check if post exists
  const isExist = await Post.findById(postId);

  if (!isExist) {
    throw new AppError("Post not found", StatusCodes.NOT_FOUND);
  }

  // 🔹 Delete images from cloudinary
  for (const img of isExist.images || []) {
    await deleteFromCloudinary(img.public_id);
  }

  // 🔹 Delete post
  const result = await Post.findByIdAndDelete(postId);
  return result;
};

const postService = {
  createNewPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
};

export default postService;
