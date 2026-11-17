import { NextResponse } from 'next/server';
import { getServerAccounts, sanitizeAccount } from '@/lib/server-auth-store';

export async function GET() {
  const accounts = getServerAccounts().map(sanitizeAccount);
  return NextResponse.json({
    success: true,
    data: accounts,
  });
}
