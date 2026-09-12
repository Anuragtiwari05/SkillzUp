import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // If already connected, return existing connection meesage 
  if (connection.isConnected) {
    console.log('Already connected to database');
    return;
  }

  try {
    // Connect to mongo db atlas
    const db = await mongoose.connect(process.env.MONGODB_URI || '');

    connection.isConnected = db.connections[0].readyState;
    console.log('MongoDB connected successfully');

    // One-time index sync so the old ChatSession TTL index (auto-delete after
    // 7 days) is dropped now that conversations should persist. This only
    // changes indexes, not documents — no existing data is touched.
    const ChatSession = (await import('@/models/chatsession')).default;
    await ChatSession.syncIndexes();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

export default dbConnect;