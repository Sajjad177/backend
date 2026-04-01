import { Types } from "mongoose";

export interface IComment {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}
