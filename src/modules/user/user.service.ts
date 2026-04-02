import { StatusCodes } from "http-status-codes";
import config from "../../config";
import AppError from "../../errors/AppError";
import { createToken } from "../../utils/tokenGenerate";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const registerUser = async (payload: IUser) => {
  const existingUser = await User.isUserExistByEmail(payload.email);
  if (existingUser) {
    throw new AppError(
      "An account with this email already exists. Please log in.",
      StatusCodes.CONFLICT,
    );
  }

  if (payload.password.length < 6) {
    throw new AppError(
      "Password must be at least 6 characters long",
      StatusCodes.BAD_REQUEST,
    );
  }

  const result = await User.create({
    ...payload,
  });

  const JwtToken = {
    userId: result._id,
    email: result.email,
    role: result.role,
  };

  const accessToken = createToken(
    JwtToken,
    config.JWT_SECRET as string,
    config.JWT_EXPIRES_IN as string,
  );

  const refreshToken = createToken(
    JwtToken,
    config.refreshTokenSecret as string,
    config.jwtRefreshTokenExpiresIn as string,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: result._id,
      firstName: result.firstName,
      lastName: result.lastName,
    },
  };
};

const getAllUsers = async () => {
  const result = await User.find().select(
    "username firstName lastName email role",
  );
  return result;
};

const getMyProfile = async (email: string) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser)
    throw new AppError(
      "No account found with the provided credentials.",
      StatusCodes.NOT_FOUND,
    );

  const result = await User.findOne({ email }).select(
    "-password -otp -otpExpires -resetPasswordOtp -resetPasswordOtpExpires",
  );

  return result;
};

const userService = {
  registerUser,
  getAllUsers,
  getMyProfile,
};

export default userService;
