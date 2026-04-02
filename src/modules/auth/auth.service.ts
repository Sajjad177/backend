import { StatusCodes } from "http-status-codes";
import config from "../../config";
import AppError from "../../errors/AppError";
import { createToken, verifyToken } from "../../utils/tokenGenerate";
import { User } from "../user/user.model";

const login = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const user = await User.isUserExistByEmail(email);
  if (!user)
    throw new AppError(
      "No account found with the provided credentials.",
      StatusCodes.NOT_FOUND,
    );

  const isPasswordValid = await User.isPasswordMatch(password, user.password);
  if (!isPasswordValid)
    throw new AppError("Invalid password", StatusCodes.UNAUTHORIZED);

  const tokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    tokenPayload,
    config.JWT_SECRET as string,
    config.JWT_EXPIRES_IN as string,
  );

  const refreshToken = createToken(
    tokenPayload,
    config.refreshTokenSecret as string,
    config.jwtRefreshTokenExpiresIn as string,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };
};

const refreshToken = async (token: string) => {
  let decodedToken;

  try {
    decodedToken = verifyToken(token, config.refreshTokenSecret as string);
    if (!decodedToken) {
      throw new AppError("Invalid token", StatusCodes.UNAUTHORIZED);
    }
  } catch (error) {
    throw new AppError("You are not authorized", StatusCodes.UNAUTHORIZED);
  }

  const email = decodedToken.email as string;
  const userData = await User.findOne({ email });

  if (!userData) {
    throw new Error("No account found with the provided credentials.");
  }

  const JwtPayload = {
    userId: userData._id,
    role: userData.role,
    email: userData.email,
  };

  const accessToken = createToken(
    JwtPayload,
    config.JWT_SECRET as string,
    config.JWT_EXPIRES_IN as string,
  );

  return { accessToken };
};

const authService = {
  login,
  refreshToken,
};

export default authService;
