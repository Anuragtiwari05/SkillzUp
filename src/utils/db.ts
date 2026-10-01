import mongoose from "mongoose";

// Cache the connection on `globalThis` so serverless invocations (Vercel) and dev hot-reloads
// reuse one connection instead of opening a new one per request.
const globalWithMongoose = globalThis as typeof globalThis & {
  _mongooseConn?: { promise: Promise<typeof mongoose> | null };
};
const cached = (globalWithMongoose._mongooseConn ??= { promise: null });

async function dbConnect(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  if (mongoose.connection.readyState === 1) return;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 10000 })
      .then(async (m) => {
        // One-time index sync so the old ChatSession TTL index (auto-delete after
        // 7 days) is dropped now that conversations should persist.
        const ChatSession = (await import("@/models/chatsession")).default;
        await ChatSession.syncIndexes();
        return m;
      })
      .catch((err) => {
        cached.promise = null; // allow a retry on the next request
        throw err;
      });
  }

  await cached.promise;
}

export default dbConnect;
