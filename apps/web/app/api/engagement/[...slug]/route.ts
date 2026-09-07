import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const [resourceId, action] = params.slug;

  if (!resourceId) {
    return NextResponse.json(
      { success: false, message: 'Resource ID required' },
      { status: 400 }
    );
  }

  if (action === 'download') {
    return NextResponse.json({
      success: true,
      message: 'Download recorded',
      data: { resourceId, timestamp: new Date().toISOString() },
    });
  }

  if (action === 'bookmark') {
    return NextResponse.json({
      success: true,
      message: 'Bookmark status toggled',
      data: { resourceId, bookmarked: true },
    });
  }

  if (action === 'rating') {
    const body = await request.json().catch(() => ({ stars: 5 }));
    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Rating saved successfully',
      data: {
        resourceId,
        averageRating: 4.8,
        qualityScore: 92,
        stars: body.stars || 5,
      },
    });
  }

  if (action === 'reviews') {
    const body = await request.json().catch(() => ({ content: '' }));
    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: 'Review posted! You earned +2 Charity Points.',
        data: {
          id: `rev-${Date.now()}`,
          resourceId,
          content: body.content || 'Great academic note!',
          userName: 'Benefactor Scholar',
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }

  if (action === 'report') {
    const body = await request.json().catch(() => ({}));
    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: 'Report submitted to Charity Police moderation queue.',
        data: {
          id: `rep-${Date.now()}`,
          resourceId,
          reason: body.reason || 'Other',
          details: body.details || '',
          status: 'PENDING',
        },
      },
      { status: 201 }
    );
  }

  return NextResponse.json(
    { success: false, message: `Unknown action: ${action}` },
    { status: 400 }
  );
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const [resourceId, action] = params.slug;

  if (action === 'reviews') {
    return NextResponse.json({
      success: true,
      data: [
        {
          id: 'rev-1',
          resourceId,
          userName: 'Sarah Ahmed',
          comment: 'Accurate and comprehensive material!',
          rating: 5,
          createdAt: '2024-02-10',
        },
      ],
    });
  }

  return NextResponse.json(
    { success: false, message: 'Not found' },
    { status: 404 }
  );
}
