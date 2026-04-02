import { Router } from "express";
import { loginLimiter } from "../../middleware/security";
import validateRequest from "../../middleware/validateRequest";
import authController from "./auth.controller";
import { authValidationSchema } from "./auth.validation";

const router = Router();

router.post(
  "/login",
  loginLimiter,
  validateRequest(authValidationSchema.authValidation),
  authController.login,
);

router.post("/refresh-token", authController.refreshToken);

const authRouter = router;
export default authRouter;
