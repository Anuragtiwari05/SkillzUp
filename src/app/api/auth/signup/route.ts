import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/utils/db';
import User from '@/models/User';

const jwtSecret = process.env.JWT_SECRET as string; // Make sure this is set in .env

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const { name, email, username, password } = await req.json();

    // Validation
    if (!name || !email || !username || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormat.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Username validation (alphanumeric, 3-20 chars)
    const usernameFormat = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameFormat.test(username)) {
      return NextResponse.json(
        { success: false, message: 'Username must be 3-20 characters (letters, numbers, underscore only)' },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { success: false, message: 'Email already registered' },
          { status: 409 }
        );
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          { success: false, message: 'Username already taken' },
          { status: 409 }
        );
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      username,
      password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id.toString(), username: newUser.username, email: newUser.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Send response with token in httpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username
        }
      },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during signup' },
      { status: 500 }
    );
  }
}
