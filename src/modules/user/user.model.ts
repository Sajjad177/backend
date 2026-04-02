import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import config from "../../config";
import { applyEncryption } from "../../middleware/encryptionMiddleware";
import { IUser, userModel } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcryptSaltRounds),
  );

  next();
});

userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.statics.isPasswordMatch = async function (
  password: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(password, hashedPassword);
};

userSchema.statics.isUserExistByEmail = async function (
  email: string,
): Promise<IUser | null> {
  return await User.findOne({ email });
};

userSchema.statics.isUserExistById = async function (
  _id: string,
): Promise<IUser | null> {
  return await User.findOne({ _id });
};

export const User = model<IUser, userModel>("User", userSchema);
