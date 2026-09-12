import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResourceLink {
  title: string;
  url: string;
  type?: string;
}

export interface IStage {
  title: string;
  description: string;
  estimatedTime?: string;
  resources: IResourceLink[];
  completed: boolean;
}

export interface IUserRoadmap extends Document {
  userId: string;
  topic: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  goal: "job" | "hobby" | "exam";
  timeAvailability?: "lt2" | "2to5" | "5plus";
  stages: IStage[];
  createdAt: Date;
  completionPercent: number;
}

const ResourceLinkSchema = new Schema<IResourceLink>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String },
  },
  { _id: false }
);

const StageSchema = new Schema<IStage>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    estimatedTime: { type: String },
    resources: { type: [ResourceLinkSchema], default: [] },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserRoadmapSchema = new Schema<IUserRoadmap>({
  userId: { type: String, required: true, index: true },
  topic: { type: String, required: true },
  skillLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  goal: {
    type: String,
    enum: ["job", "hobby", "exam"],
    required: true,
  },
  timeAvailability: {
    type: String,
    enum: ["lt2", "2to5", "5plus"],
  },
  stages: { type: [StageSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

UserRoadmapSchema.virtual("completionPercent").get(function (this: IUserRoadmap) {
  if (!this.stages || this.stages.length === 0) return 0;
  const done = this.stages.filter((s) => s.completed).length;
  return Math.round((done / this.stages.length) * 100);
});

UserRoadmapSchema.set("toJSON", { virtuals: true });
UserRoadmapSchema.set("toObject", { virtuals: true });

const UserRoadmap: Model<IUserRoadmap> =
  mongoose.models.UserRoadmap ||
  mongoose.model<IUserRoadmap>("UserRoadmap", UserRoadmapSchema, "user_roadmaps");

export default UserRoadmap;
