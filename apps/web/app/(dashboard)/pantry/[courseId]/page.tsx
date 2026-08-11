import CoursePantryView from './CoursePantryView';

// Required for Next.js static export (GitHub Pages)
export function generateStaticParams() {
  return [
    { courseId: 'cse-2103' },
    { courseId: 'cse-3101' },
    { courseId: 'cse-3205' },
  ];
}

export default function CoursePantryDetailPage({ params }: { params: { courseId: string } }) {
  return <CoursePantryView courseId={params.courseId} />;
}
