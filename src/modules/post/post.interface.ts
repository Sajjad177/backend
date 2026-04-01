import { Types } from "mongoose";

export interface IPost {
  authorId: Types.ObjectId;
  text: string;
  images: {
    public_id: string;
    url: string;
  }[];
  totalComments: number;
  totalLikes: number;
  createdAt?: Date;
  updatedAt?: Date;
}
