import { Types } from "mongoose";

export interface ILikes {
  userId: Types.ObjectId;
  targetId: Types.ObjectId;
  postId: Types.ObjectId;
  targetType: "Post" | "Comment" | "ReplyComment";
  createdAt?: Date;
  updatedAt?: Date;
}
