import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_RESOURCES } from '@/lib/resources-data';

export async function GET(
  _request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params;
  const norm = courseId.toUpperCase().replace(/[-_]/g, ' ');
  const codeOnly = norm.replace(/\s+/g, '');

  const matchingQuestions = INITIAL_RESOURCES.filter((r) => {
    const isQuestion =
      r.academicMetadata?.section === 'question' ||
      r.resourceType === 'Previous Exam Questions' ||
      r.resourceType === 'Solved Questions';

    if (!isQuestion) return false;
    if (courseId === 'ALL') return true;

    const targetCode = r.courseCode.toUpperCase().replace(/\s+/g, '');
    return targetCode === codeOnly || r.courseCode.toUpperCase().includes(norm);
  });

  const ctPapers = matchingQuestions.filter(
    (r) => r.academicMetadata?.examType === 'CT'
  );
  const midPapers = matchingQuestions.filter(
    (r) => r.academicMetadata?.examType === 'MID'
  );
  const finalPapers = matchingQuestions.filter(
    (r) => r.academicMetadata?.examType === 'FINAL' || !r.academicMetadata?.examType
  );

  return NextResponse.json({
    success: true,
    statusCode: 200,
    message: 'Exam Emergency Room data loaded.',
    data: {
      course: {
        code: norm,
        title: matchingQuestions[0]?.courseName || 'Academic Course',
      },
      stats: {
        totalEmergencyPacks: matchingQuestions.length,
        ctCount: ctPapers.length,
        midCount: midPapers.length,
        finalCount: finalPapers.length,
      },
      sections: {
        ctPapers,
        midPapers,
        finalPapers,
      },
    },
  });
}
