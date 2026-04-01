import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import commentController from "./comment.controller";

const router = Router();

router.post("/add", auth(USER_ROLE.USER), commentController.createComment);

router.get("/", commentController.getAllComments);

const commentRouter = router;
export default commentRouter;
