import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import Comment from "../comment/comment.model";
import Post from "../post/post.model";
import ReplyComment from "../replyComment/replyComment.model";
import { User } from "../user/user.model";
import Likes from "./likes.model";

const toggleLikeForPost = async (email: string, postId: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      "Your account is not found. Please sign up to create a post.",
      StatusCodes.NOT_FOUND,
    );
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", StatusCodes.NOT_FOUND);
  }

  const existingLike = await Likes.findOne({
    userId: user._id, // should match your LikesSchema
    targetId: postId,
    targetType: "Post",
  });

  if (existingLike) {
    await Likes.findByIdAndDelete(existingLike._id);

    // decrement likeCount
    await Post.findByIdAndUpdate(postId, { $inc: { totalLikes: -1 } });

    return { liked: false };
  } else {
    await Likes.create({
      userId: user._id,
      targetId: postId,
      targetType: "Post",
    });

    // increment likeCount
    await Post.findByIdAndUpdate(postId, { $inc: { totalLikes: 1 } });

    return { liked: true };
  }
};

const toggleLikeForComment = async (email: string, commentId: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      "Your account is not found. Please sign up to create a post.",
      StatusCodes.NOT_FOUND,
    );
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError("Comment not found", StatusCodes.NOT_FOUND);
  }

  const existingLike = await Likes.findOne({
    userId: user._id,
    targetId: commentId,
    targetType: "Comment",
  });

  if (existingLike) {
    await Likes.findByIdAndDelete(existingLike._id);
    await Comment.findByIdAndUpdate(commentId, {
      $inc: { commentTotalLikes: -1 },
    });

    return { liked: false };
  } else {
    await Likes.create({
      userId: user._id,
      targetId: commentId,
      targetType: "Comment",
    });
    await Comment.findByIdAndUpdate(commentId, {
      $inc: { commentTotalLikes: 1 },
    });

    return { liked: true };
  }
};

const toggleLikeForCommentReply = async (
  email: string,
  replyCommentId: string,
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      "Your account is not found. Please sign up to create a post.",
      StatusCodes.NOT_FOUND,
    );
  }

  const replyComment = await ReplyComment.findById(replyCommentId);
  if (!replyComment) {
    throw new AppError("Reply comment not found", StatusCodes.NOT_FOUND);
  }

  const existingLike = await Likes.findOne({
    userId: user._id,
    targetId: replyCommentId,
    targetType: "ReplyComment",
  });

  if (existingLike) {
    await Likes.findByIdAndDelete(existingLike._id);
    await ReplyComment.findByIdAndUpdate(replyCommentId, {
      $inc: { replyCommentTotalLikes: -1 },
    });

    return { liked: false };
  } else {
    await Likes.create({
      userId: user._id,
      targetId: replyCommentId,
      targetType: "ReplyComment",
    });
    await ReplyComment.findByIdAndUpdate(replyCommentId, {
      $inc: { replyCommentTotalLikes: 1 },
    });

    return { liked: true };
  }
};

const getAllLikesByPost = async (postId: string) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", StatusCodes.NOT_FOUND);
  }

  const likes = await Likes.find({
    targetId: postId,
    targetType: "Post",
  }).populate("userId", "firstName lastName");

  return likes;
};

const getAllLikesByComment = async (commentId: string) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError("Comment not found", StatusCodes.NOT_FOUND);
  }

  const likes = await Likes.find({
    targetId: commentId,
    targetType: "Comment",
  }).populate("userId", "firstName lastName");

  return likes;
};

const getAllLikesByReplyComment = async (replyCommentId: string) => {
  const replyComment = await ReplyComment.findById(replyCommentId);
  if (!replyComment) {
    throw new AppError("Reply comment not found", StatusCodes.NOT_FOUND);
  }

  const likes = await Likes.find({
    targetId: replyCommentId,
    targetType: "ReplyComment",
  }).populate("userId", "firstName lastName");

  return likes;
};

const likesService = {
  toggleLikeForPost,
  getAllLikesByPost,
  toggleLikeForComment,
  toggleLikeForCommentReply,
  getAllLikesByComment,
  getAllLikesByReplyComment,
};

export default likesService;
