import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_RESOURCES, Resource } from '@/lib/initial-resources';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');
  const examType = searchParams.get('examType');
  const materialType = searchParams.get('materialType');
  const batch = searchParams.get('batch');
  const courseCode = searchParams.get('courseCode') || searchParams.get('courseId');
  const query = searchParams.get('q')?.toLowerCase().trim();

  let filtered = [...INITIAL_RESOURCES];

  if (section && section !== 'ALL') {
    filtered = filtered.filter((r) => r.academicMetadata?.section === section);
  }

  if (examType && examType !== 'ALL') {
    filtered = filtered.filter((r) => r.academicMetadata?.examType === examType);
  }

  if (materialType && materialType !== 'ALL') {
    filtered = filtered.filter((r) => r.academicMetadata?.materialType === materialType);
  }

  if (batch && batch !== 'ALL') {
    filtered = filtered.filter((r) => r.academicMetadata?.batch === batch);
  }

  if (courseCode && courseCode !== 'ALL') {
    const norm = courseCode.toUpperCase().replace(/[-_]/g, ' ');
    const codeOnly = norm.replace(/\s+/g, '');
    filtered = filtered.filter((r) => {
      const targetNorm = r.courseCode.toUpperCase().replace(/\s+/g, '');
      return targetNorm === codeOnly || r.courseCode.toUpperCase().includes(norm);
    });
  }

  if (query) {
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        r.courseCode.toLowerCase().includes(query) ||
        r.courseName.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newResource: Resource = {
      ...body,
      id: body.id || `res-${Date.now()}`,
      createdAt: body.createdAt || new Date().toISOString().split('T')[0],
      qualityScore: body.qualityScore || 90,
      rating: body.rating || 5.0,
      ratingCount: body.ratingCount || 1,
      downloadsCount: body.downloadsCount || 0,
      bookmarksCount: body.bookmarksCount || 0,
      fileHash: body.fileHash || `sha256:custom-${Date.now()}`,
      reviews: body.reviews || [],
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Resource published successfully',
        data: newResource,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to process request' },
      { status: 400 }
    );
  }
}
