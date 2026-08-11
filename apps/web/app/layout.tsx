import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "PEER'S CHARITY — Give a Note. Get a Note. Save a Semester.",
  description: "Academic resource sharing platform where university students help each other with high-quality notes, exam solutions, and study materials.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-accent selection:text-accent-foreground">
        {children}
      </body>
    </html>
  );
}
