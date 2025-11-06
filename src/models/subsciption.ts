import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
  userId: string;
  planId: string;
  razorpaySubscriptionId: string;
  status: "created" | "active" | "paused" | "cancelled" | "expired";
  startAt: Date;
  endAt?: Date;
  nextBillingAt?: Date;
  createdAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: { type: String, required: true },
  planId: { type: String, required: true },
  razorpaySubscriptionId: { type: String, required: true },
  status: {
    type: String,
    enum: ["created", "active", "paused", "cancelled", "expired"],
    default: "created",
  },
  startAt: { type: Date, required: true },
  endAt: { type: Date },
  nextBillingAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
