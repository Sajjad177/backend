import { model, Schema } from "mongoose";
import { IPost } from "./post.interface";

const PostSchema = new Schema<IPost>({
  authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  visibility: { type: String, enum: ["public", "private"], required: true },
  totalComments: { type: Number, default: 0 },
  totalLikes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Post = model<IPost>("Post", PostSchema);

export default Post;
