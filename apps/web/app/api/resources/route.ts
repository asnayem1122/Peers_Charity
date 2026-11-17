import { NextRequest, NextResponse } from 'next/server';
import { Resource } from '@/lib/initial-resources';
import { getServerResources, addServerResource } from '@/lib/server-resource-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');
  const examType = searchParams.get('examType');
  const materialType = searchParams.get('materialType');
  const batch = searchParams.get('batch');
  const courseCode = searchParams.get('courseCode') || searchParams.get('courseId');
  const query = searchParams.get('q')?.toLowerCase().trim();

  let filtered = [...getServerResources()];

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
        r.tags.some((t) => t.toLowerCase().includes(query)) ||
        (r.academicMetadata?.labNumber && String(r.academicMetadata.labNumber).toLowerCase().includes(query))
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
    const contentType = request.headers.get('content-type') || '';
    let body: any = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      body.title = formData.get('title') as string;
      body.description = formData.get('description') as string;
      body.courseCode = (formData.get('courseId') as string) || (formData.get('courseCode') as string) || 'CSE 2103';
      body.courseName = (formData.get('courseName') as string) || `${body.courseCode} Course Material`;
      body.semester = formData.get('semester') as string;
      body.resourceType = formData.get('resourceType') as string;
      body.externalUrl = formData.get('externalUrl') as string;

      const meta = formData.get('academicMetadata');
      if (meta) {
        body.academicMetadata = typeof meta === 'string' ? JSON.parse(meta) : meta;
      }

      const file = formData.get('file') as File | null;
      if (file && typeof file === 'object' && 'name' in file) {
        body.fileName = file.name;
        body.fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
        body.fileUrl = `/samples/${file.name}`;
      }
    } else {
      body = await request.json();
    }

    const courseCode = body.courseCode || body.courseId || 'CSE 2103';
    const newResource: Resource = {
      id: body.id || `res-${Date.now()}`,
      title: body.title || `${courseCode} Resource`,
      description: body.description || 'Verified academic resource contribution.',
      courseCode,
      courseName: body.courseName || `${courseCode} Course Material`,
      department: body.department || 'Computer Science & Engineering',
      semester: body.semester || 'Level 2 / Term 1',
      resourceType: body.resourceType || 'Notes',
      academicMetadata: body.academicMetadata,
      contentSource: body.contentSource || 'Created by me',
      fileUrl: body.fileUrl || (body.externalUrl ? undefined : '/samples/demo.pdf'),
      fileName: body.fileName || (body.fileUrl ? body.fileUrl.split('/').pop() : undefined),
      fileSize: body.fileSize || '2.4 MB',
      externalUrl: body.externalUrl || body.academicMetadata?.externalLink,
      realUploaderId: body.realUploaderId || 'user_demo',
      realUploaderEmail: body.realUploaderEmail || 'benefactor@demo.com',
      realUploaderName: body.realUploaderName || 'Academic Benefactor',
      displayMode: body.displayMode || 'PROFILE',
      publicDisplayIdentity: body.publicDisplayIdentity || body.realUploaderName || 'Academic Benefactor',
      tags: body.tags || [courseCode, body.academicMetadata?.section || 'Resource', 'Contribution'],
      qualityScore: body.qualityScore || 90,
      rating: body.rating || 5.0,
      ratingCount: body.ratingCount || 1,
      downloadsCount: body.downloadsCount || 0,
      bookmarksCount: body.bookmarksCount || 0,
      createdAt: body.createdAt || new Date().toISOString().split('T')[0],
      fileHash: body.fileHash || `sha256:custom-${Date.now()}`,
      reviews: body.reviews || [],
    };

    // Store in global runtime store so subsequent requests return the created item
    addServerResource(newResource);

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
