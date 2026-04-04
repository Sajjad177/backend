import { Types } from "mongoose";

export interface IReplyComment {
  commentId: Types.ObjectId;
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  text: string;
  replyCommentTotalLikes: number;
  createdAt?: Date;
  updatedAt?: Date;
}
