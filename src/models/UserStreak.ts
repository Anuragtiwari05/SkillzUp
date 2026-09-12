import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserStreak extends Document {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  updatedAt: Date;
}

const UserStreakSchema = new Schema<IUserStreak>({
  userId: { type: String, required: true, unique: true },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now },
});

const UserStreak: Model<IUserStreak> =
  mongoose.models.UserStreak ||
  mongoose.model<IUserStreak>("UserStreak", UserStreakSchema, "user_streaks");

export default UserStreak;
