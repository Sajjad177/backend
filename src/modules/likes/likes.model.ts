import { model, Schema } from "mongoose";
import { ILikes } from "./likes.interface";

const LikesSchema = new Schema<ILikes>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },
    targetType: {
      type: String,
      enum: ["Post", "Comment", "ReplyComment"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

LikesSchema.index({ user: 1, targetId: 1, targetType: 1 }, { unique: true });

const Likes = model<ILikes>("Likes", LikesSchema);
export default Likes;
