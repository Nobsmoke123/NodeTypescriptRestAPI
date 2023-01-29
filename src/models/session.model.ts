import mongoose, { Schema, model, Types } from "mongoose";
import { IUser } from "./user.model";

export interface ISession extends mongoose.Document {
  user: IUser["id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },

    valid: {
      type: Boolean,
      default: true,
    },

    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const SessionModel = model<ISession>("Session", sessionSchema);

export default SessionModel;
