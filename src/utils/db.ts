import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // If already connected, return existing connection
  if (connection.isConnected) {
    console.log('Already connected to database');
    return;
  }

  try {
    // Connect to mongo db atlas
    const db = await mongoose.connect(process.env.MONGODB_URI || '');

    connection.isConnected = db.connections[0].readyState;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

export default dbConnect;