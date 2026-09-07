import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_RESOURCES } from '@/lib/resources-data';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const resource = INITIAL_RESOURCES.find((r) => r.id === id);

  if (!resource) {
    return NextResponse.json(
      { success: false, message: 'Resource not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: resource,
  });
}
