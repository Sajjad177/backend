import { Types } from "mongoose";

export interface ILikes {
  user: Types.ObjectId;
  postId?: Types.ObjectId;
  commentId?: Types.ObjectId;
  replyCommentId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
