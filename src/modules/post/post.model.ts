import { model, Schema } from "mongoose";
import { IPost } from "./post.interface";

const PostSchema = new Schema<IPost>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
        _id: false,
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    totalComments: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    postTime: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false },
);

const Post = model<IPost>("Post", PostSchema);

export default Post;
