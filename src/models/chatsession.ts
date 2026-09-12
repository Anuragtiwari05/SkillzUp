import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IRoadmapOnboardingAnswers {
  skillLevel?: "beginner" | "intermediate" | "advanced";
  goal?: "job" | "hobby" | "exam";
  timeAvailability?: "lt2" | "2to5" | "5plus";
}

export interface IRoadmapOnboarding {
  topic: string;
  step: "skillLevel" | "goal" | "time";
  answers: IRoadmapOnboardingAnswers;
}

export interface IChatSession extends Document {
  userId: string; // linked to your User model _id ("anonymous" for guests)
  sessionId: string; // for session id
  title?: string; // auto-set from the first user message, for the Chat History list
  messages: IMessage[];
  roadmapOnboarding?: IRoadmapOnboarding | null; // in-progress conversational roadmap flow
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const RoadmapOnboardingSchema = new Schema<IRoadmapOnboarding>(
  {
    topic: { type: String, required: true },
    step: { type: String, enum: ["skillLevel", "goal", "time"], required: true },
    answers: {
      skillLevel: { type: String, enum: ["beginner", "intermediate", "advanced"] },
      goal: { type: String, enum: ["job", "hobby", "exam"] },
      timeAvailability: { type: String, enum: ["lt2", "2to5", "5plus"] },
    },
  },
  { _id: false }
);

const ChatSessionSchema = new Schema<IChatSession>({
  userId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true, unique: true },
  title: { type: String },
  messages: [MessageSchema],
  roadmapOnboarding: { type: RoadmapOnboardingSchema, default: null },
  createdAt: { type: Date, default: Date.now }, // no more TTL — conversations persist (Section 6)
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.ChatSession ||
  mongoose.model<IChatSession>("ChatSession", ChatSessionSchema);
