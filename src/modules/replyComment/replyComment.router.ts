import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import replyCommentController from "./replyComment.controller";

const router = Router();

router.post(
  "/add",
  auth(USER_ROLE.USER),
  replyCommentController.addReplyComment,
);

router.get("/:commentId", replyCommentController.getAllReplyCommentByCommentId);

const replyCommentRouter = router;
export default replyCommentRouter;
