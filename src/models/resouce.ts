import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResource extends Document {
  topic: string;
  type: "article" | "video" | "course" | "news";
  title: string;
  description?: string;
  links: string[];       // can store multiple links (PDF, video, etc.)
  source?: string;       // platform or website name
  format?: "text" | "pdf" | "video" | "link"; // resource format
  thumbnail?: string;
  fetchedAt: Date;
}

const ResourceSchema: Schema<IResource> = new Schema({
  topic: { type: String, required: true },
  type: { type: String, enum: ["article", "video", "course", "news"], required: true },
  title: { type: String, required: true },
  description: { type: String },
  links: { type: [String], required: true },  // can store multiple links
  source: { type: String },
  format: { type: String, enum: ["text", "pdf", "video", "link"] },
  thumbnail: { type: String },
  fetchedAt: { type: Date, default: Date.now },
});

// Avoid recompiling model in Next.js hot reloads
const Resource: Model<IResource> = mongoose.models.Resource || mongoose.model<IResource>("Resource", ResourceSchema);

export default Resource;
