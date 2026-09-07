import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_RESOURCES, Resource } from '@/lib/resources-data';

export async function GET(
  _request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params;
  const norm = courseId.toUpperCase().replace(/[-_]/g, ' ');
  const codeOnly = norm.replace(/\s+/g, '');

  const sessionals = INITIAL_RESOURCES.filter((r) => {
    if (r.academicMetadata?.section !== 'sessional' && r.resourceType !== 'Lab Reports') return false;
    if (courseId === 'ALL') return true;
    const targetCode = r.courseCode.toUpperCase().replace(/\s+/g, '');
    return targetCode === codeOnly || r.courseCode.toUpperCase().includes(norm);
  });

  const batchMap: Record<string, Resource[]> = {};
  sessionals.forEach((r) => {
    const batch = r.academicMetadata?.batch || 'Batch 11';
    if (!batchMap[batch]) batchMap[batch] = [];
    batchMap[batch].push(r);
  });

  return NextResponse.json({
    success: true,
    statusCode: 200,
    message: 'Sessional data loaded.',
    data: {
      course: {
        code: norm,
        title: sessionals[0]?.courseName || 'Laboratory Course',
      },
      stats: {
        totalSessionalResources: sessionals.length,
        batchCount: Object.keys(batchMap).length,
      },
      batches: batchMap,
    },
  });
}
