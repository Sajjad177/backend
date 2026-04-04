import { model, Schema } from "mongoose";
import { IReplyComment } from "./replyComment.interface";

const replyCommentSchema = new Schema<IReplyComment>(
  {
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
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
    replyCommentTotalLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

const ReplyComment = model<IReplyComment>("ReplyComment", replyCommentSchema);
export default ReplyComment;
