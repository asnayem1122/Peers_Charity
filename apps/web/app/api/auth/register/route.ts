import { NextRequest, NextResponse } from 'next/server';
import {
  findServerAccount,
  addServerAccount,
  hashPassword,
  ServerAccount,
} from '@/lib/server-auth-store';
import { User } from '@/lib/auth-context';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, levelTerm, studentId } = body;

    if (!email || !name) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required for registration.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existing = findServerAccount(trimmedEmail);

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'An account with this email address already exists. Please log in.' },
        { status: 400 }
      );
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      role: 'STUDENT',
      avatarUrl: '',
      avatarName: '',
      levelTerm: levelTerm || 'Level 3 / Term 1',
      studentId: studentId?.trim(),
    };

    const newAccount: ServerAccount = {
      email: trimmedEmail,
      passwordHash: hashPassword(password || 'password123'),
      user: newUser,
    };

    addServerAccount(newAccount);

    return NextResponse.json(
      {
        success: true,
        message: 'Account registered successfully',
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
