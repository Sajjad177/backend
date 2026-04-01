import { Router } from "express";
import auth from "../../middleware/auth";
import { upload } from "../../middleware/multer.middleware";
import { USER_ROLE } from "../user/user.constant";
import postController from "./post.controller";

const router = Router();

router.post(
  "/create",
  upload.array("images", 10),
  auth(USER_ROLE.USER),
  postController.createNewPost,
);

const postRouter = router;
export default postRouter;
