import mongoose, { Schema, Document, Model } from "mongoose";

interface ILastRoadmap {
  id: string;
  topic: string;
  viewedAt: Date;
}

interface ILastFeatureView {
  type: "video" | "article" | "news";
  url: string;
  title: string;
  viewedAt: Date;
}

interface ILastChatSession {
  id: string;
  title: string;
  viewedAt: Date;
}

export interface IUserActivity extends Document {
  userId: string;
  lastRoadmap?: ILastRoadmap;
  lastFeatureView?: ILastFeatureView;
  lastChatSession?: ILastChatSession;
  updatedAt: Date;
}

const UserActivitySchema = new Schema<IUserActivity>({
  userId: { type: String, required: true, unique: true },
  lastRoadmap: {
    id: String,
    topic: String,
    viewedAt: Date,
  },
  lastFeatureView: {
    type: { type: String, enum: ["video", "article", "news"] },
    url: String,
    title: String,
    viewedAt: Date,
  },
  lastChatSession: {
    id: String,
    title: String,
    viewedAt: Date,
  },
  updatedAt: { type: Date, default: Date.now },
});

const UserActivity: Model<IUserActivity> =
  mongoose.models.UserActivity ||
  mongoose.model<IUserActivity>("UserActivity", UserActivitySchema, "user_activity");

export default UserActivity;
