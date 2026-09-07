import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      university: {
        name: 'Bangladesh Army University of Science and Technology',
        shortName: 'BAUST',
        code: 'BAUST',
      },
      departments: [
        {
          name: 'Computer Science & Engineering',
          code: 'CSE',
          courses: [
            { code: 'CSE 2103', title: 'Database Systems', semester: 'Level 2 / Term 1' },
            { code: 'CSE 2104', title: 'Database Systems Sessional', semester: 'Level 2 / Term 1' },
            { code: 'CSE 2105', title: 'Data Structures & Algorithms', semester: 'Level 2 / Term 1' },
            { code: 'CSE 2106', title: 'Data Structures Sessional', semester: 'Level 2 / Term 1' },
          ],
        },
        {
          name: 'Electrical & Electronic Engineering',
          code: 'EEE',
          courses: [
            { code: 'EEE 1201', title: 'Electrical Circuit Analysis', semester: 'Level 1 / Term 2' },
          ],
        },
        {
          name: 'Basic Science & Humanities',
          code: 'BSH',
          courses: [
            { code: 'MATH 2101', title: 'Mathematics III (Differential Equations)', semester: 'Level 2 / Term 1' },
          ],
        },
      ],
    },
  });
}
