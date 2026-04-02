import { StatusCodes } from "http-status-codes";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import authService from "./auth.service";

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "You have logged in successfully.",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Access token refreshed successfully",
    data: result,
  });
});

const authController = {
  login,
  refreshToken,
};

export default authController;
