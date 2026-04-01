import { model, Schema } from "mongoose";
import { IComment } from "./comment.interface";

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    commentTotalLikes: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true, versionKey: false },
);

const Comment = model("Comment", CommentSchema);
export default Comment;
