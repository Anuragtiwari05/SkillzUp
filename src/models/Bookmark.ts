import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBookmark extends Document {
  userId: string;
  itemType: "video" | "article" | "news";
  sourceUrl: string;
  title: string;
  thumbnailUrl?: string;
  savedAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>({
  userId: { type: String, required: true, index: true },
  itemType: { type: String, enum: ["video", "article", "news"], required: true },
  sourceUrl: { type: String, required: true },
  title: { type: String, required: true },
  thumbnailUrl: { type: String },
  savedAt: { type: Date, default: Date.now },
});

BookmarkSchema.index({ userId: 1, sourceUrl: 1 }, { unique: true });

const Bookmark: Model<IBookmark> =
  mongoose.models.Bookmark ||
  mongoose.model<IBookmark>("Bookmark", BookmarkSchema, "bookmarks");

export default Bookmark;
