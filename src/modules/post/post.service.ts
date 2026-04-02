/* eslint-disable prefer-const */
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
    visibility: payload.visibility,
  });
  return result;
};

const getAllPosts = async (query: any) => {
  const limit = parseInt(query.limit) || 10;
  const cursor = query.cursor;

  let filter: any = { visibility: "public" };

  if (cursor) {
    filter.createdAt = { $lt: new Date(cursor) };
  }

  const posts = await Post.find(filter)
    .populate("authorId", "firstName lastName")
    .sort({ createdAt: -1 })
    .limit(limit);

  const nextCursor =
    posts.length > 0 ? posts[posts.length - 1].createdAt : null;

  return {
    data: posts,
    nextCursor,
  };
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
  email?: string,
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      "Your account is not found. Please sign up to create a post.",
      StatusCodes.NOT_FOUND,
    );
  }

  const post = await Post.findById(postId);
  if (!post) throw new AppError("Post not found", StatusCodes.NOT_FOUND);

  if (post.authorId.toString() !== user._id.toString()) {
    throw new AppError(
      "You are not authorized to update this post.",
      StatusCodes.FORBIDDEN,
    );
  }

  let uploadedImages = post.images || [];

  if (files && files.length > 0) {
    await Promise.all(
      (post.images || []).map(async (img) => {
        try {
          await deleteFromCloudinary(img.public_id);
        } catch (err) {
          console.warn(
            `Failed to delete Cloudinary image ${img.public_id}`,
            err,
          );
        }
      }),
    );

    const uploaded = await Promise.all(
      files.map(async (file) => {
        try {
          const result = await uploadToCloudinary(file.path, "posts");
          return {
            url: result.secure_url,
            public_id: result.public_id,
          };
        } catch (err) {
          console.error(
            "Cloudinary upload failed for file:",
            file.originalname,
            err,
          );
          return null;
        }
      }),
    );

    uploadedImages = uploaded.filter(Boolean) as {
      url: string;
      public_id: string;
    }[];
  }

  const updateData: any = { ...payload };
  if (files && files.length > 0) {
    updateData.images = uploadedImages;
  }

  const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
    new: true,
    runValidators: true,
  });

  return updatedPost;
};

const deletePostById = async (postId: string, email?: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      "Your account is not found. Please sign up to create a post.",
      StatusCodes.NOT_FOUND,
    );
  }

  const isExist = await Post.findById(postId);
  if (!isExist) {
    throw new AppError("Post not found", StatusCodes.NOT_FOUND);
  }

  if (isExist.authorId.toString() !== user._id.toString()) {
    throw new AppError(
      "You are not authorized to delete this post.",
      StatusCodes.FORBIDDEN,
    );
  }

  if (isExist.images?.length) {
    await Promise.all(
      isExist.images.map((img) => deleteFromCloudinary(img.public_id)),
    );
  }

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
