import { Router } from "express";
import authRouter from "../modules/auth/auth.router";
import commentRouter from "../modules/comment/comment.router";
import likeRouter from "../modules/likes/like.route";
import postRouter from "../modules/post/post.route";
import replyCommentRouter from "../modules/replyComment/replyComment.router";
import userRouter from "../modules/user/user.router";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/post",
    route: postRouter,
  },
  {
    path: "/comment",
    route: commentRouter,
  },
  {
    path: "/replyComment",
    route: replyCommentRouter,
  },
  {
    path: "/like",
    route: likeRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
