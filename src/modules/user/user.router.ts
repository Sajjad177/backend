import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import userController from "./user.controller";
import { userValidation } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(userValidation.userValidationSchema),
  userController.registerUser,
);

router.get("/all-users", userController.getAllUsers);

const userRouter = router;
export default userRouter;
