import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IChatSession extends Document {
  userId: string; // linked to your User model _id
  sessionId: string; // for session id
  messages: IMessage[];
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatSessionSchema = new Schema<IChatSession>({
  userId: { type: String, required: true },
  sessionId: { type: String, required: true, unique: true },
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now, expires: "7d" }, // ✅ Auto delete after 7 days
});

export default mongoose.models.ChatSession ||
  mongoose.model<IChatSession>("ChatSession", ChatSessionSchema);
