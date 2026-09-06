import CoursePantryView from './CoursePantryView';

// Static params pre-rendered at build time
export function generateStaticParams() {
  return [
    { courseId: 'cse-2103' },
    { courseId: 'cse-2104' },
    { courseId: 'cse-2105' },
    { courseId: 'cse-2106' },
    { courseId: 'cse-3101' },
    { courseId: 'cse-3205' },
    { courseId: 'eee-1201' },
    { courseId: 'eee-2101' },
    { courseId: 'math-2101' },
  ];
}

export const dynamicParams = true;

export default function CoursePantryDetailPage({ params }: { params: { courseId: string } }) {
  return <CoursePantryView courseId={params.courseId} />;
}
