import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import likesController from "./likes.controller";

const router = Router();

router.post(
  "/toggle/:postId",
  auth(USER_ROLE.USER),
  likesController.toggleLikeForPost,
);

router.post(
  "/comment-toggle/:commentId",
  auth(USER_ROLE.USER),
  likesController.toggleLikeForComment,
);

router.post(
  "/reply-comment-toggle/:replyCommentId",
  auth(USER_ROLE.USER),
  likesController.toggleLikeForCommentReply,
);

router.get("/:postId", likesController.getAllLikesByPost);
router.get("/comment/:commentId", likesController.getAllLikesByComment);
router.get(
  "/reply-comment/:replyCommentId",
  likesController.getAllLikesByReplyComment,
);

const likeRouter = router;
export default likeRouter;
