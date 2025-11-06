import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  userId: string;
  amount: number;
  currency: string;
  orderId: string;
  paymentId?: string;
  status: "created" | "paid" | "failed";
  method?: string;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  orderId: { type: String, required: true },
  paymentId: { type: String },
  status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
  method: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
