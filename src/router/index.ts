import { Router } from "express";
import authRouter from "../modules/auth/auth.router";
import contactRouter from "../modules/contact/contact.router";
import postRouter from "../modules/post/post.route";
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
    path: "/contact",
    route: contactRouter,
  },
  {
    path: "/post",
    route: postRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
