import { Types } from "mongoose";

export interface ILikes {
  userId: Types.ObjectId;
  targetId: Types.ObjectId;
  targetType: "post" | "comment" | "reply";
  createdAt?: Date;
  updatedAt?: Date;
}
