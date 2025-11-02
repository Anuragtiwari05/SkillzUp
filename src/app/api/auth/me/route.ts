import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/utils/db';
import User from '@/models/User';

const jwtSecret = process.env.JWT_SECRET as string;

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Read cookies
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];

    if (!token) {
      return NextResponse.json({ success: false, user: null });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      username: string;
      email: string;
    };

    // Find user (optional but recommended)
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json({ success: false, user: null });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ success: false, user: null });
  }
}
