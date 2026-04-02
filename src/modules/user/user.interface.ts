import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface userModel extends Model<IUser> {
  isPasswordMatch(password: string, hashedPassword: string): Promise<boolean>;
  isUserExistByEmail(email: string): Promise<IUser | null>;
  isUserExistById(_id: string): Promise<IUser | null>;
}

export type TUserRole = keyof typeof USER_ROLE;
