import { Types } from "mongoose";

export interface IPost {
  authorId: Types.ObjectId;
  text: string;
  images: {
    public_id: string;
    url: string;
  }[];
  visibility: "public" | "private";
  totalComments: number;
  totalLikes: number;
  createdAt?: Date;
  updatedAt?: Date;
}
