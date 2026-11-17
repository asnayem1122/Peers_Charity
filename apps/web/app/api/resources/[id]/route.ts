import { NextRequest, NextResponse } from 'next/server';
import {
  getServerResourceById,
  updateServerResource,
  deleteServerResource,
} from '@/lib/server-resource-store';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const resource = getServerResourceById(id);

  if (!resource) {
    return NextResponse.json(
      { success: false, statusCode: 404, message: 'Resource not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    statusCode: 200,
    data: resource,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleUpdate(request, params.id);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleUpdate(request, params.id);
}

async function handleUpdate(request: NextRequest, id: string) {
  try {
    const body = await request.json();
    const updated = updateServerResource(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, statusCode: 404, message: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Resource updated successfully',
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 400, message: err?.message || 'Invalid payload' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const deleted = deleteServerResource(id);

  if (!deleted) {
    return NextResponse.json(
      { success: false, statusCode: 404, message: 'Resource not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    statusCode: 200,
    message: 'Resource deleted successfully',
    data: { id, deleted: true },
  });
}
