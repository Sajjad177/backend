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

router.get("/:postId", likesController.getAllLikesByPost);

const likeRouter = router;
export default likeRouter;
