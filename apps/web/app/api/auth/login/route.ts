import { NextRequest, NextResponse } from 'next/server';
import { findServerAccount, hashPassword, sanitizeAccount } from '@/lib/server-auth-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const account = findServerAccount(trimmedEmail);

    if (!account) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password. Please check your credentials.' },
        { status: 401 }
      );
    }

    const computedHash = hashPassword(password);
    if (account.passwordHash !== computedHash) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password. Please check your credentials.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: sanitizeAccount(account),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Login failed' },
      { status: 500 }
    );
  }
}
