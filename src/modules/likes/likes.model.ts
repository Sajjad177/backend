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
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    targetType: {
      type: String,
      enum: ["Post", "Comment", "ReplyComment"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

LikesSchema.index({ userId: 1, targetId: 1 }, { unique: true });

const Likes = model<ILikes>("Likes", LikesSchema);
export default Likes;
