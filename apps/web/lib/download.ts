import { Resource, recordDownload } from './resources-data';
import { apiRecordDownload } from './api';

// Helper to escape PDF text
function escapePdfText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

/**
 * Generates an authentic, standard-compliant PDF-1.4 Blob in the browser
 */
function createStudySheetPdfBlob(resource: Resource): Blob {
  const title = `PEER'S CHARITY — ${resource.courseCode}`;
  const subtitle = resource.title.slice(0, 70);

  const lines = [
    `# Course: ${resource.courseCode} — ${resource.courseName}`,
    `# Department: ${resource.department} | ${resource.semester}`,
    `# Section: ${resource.academicMetadata?.section ? resource.academicMetadata.section.toUpperCase() : resource.resourceType}`,
    resource.academicMetadata?.batch ? `## Batch: ${resource.academicMetadata.batch}` : '',
    resource.academicMetadata?.examType ? `## Exam Type: ${resource.academicMetadata.examType} Exam` : '',
    resource.academicMetadata?.materialType ? `## Material Type: ${resource.academicMetadata.materialType}` : '',
    resource.academicMetadata?.labNumber ? `## Lab Number: ${resource.academicMetadata.labNumber}` : '',
    `## Contributed by Benefactor: ${resource.publicDisplayIdentity}`,
    `## Quality Score: ${resource.qualityScore}% | Community Rating: ${resource.rating} / 5.0`,
    `## SHA-256 Verification: ${resource.fileHash}`,
    '',
    '# Academic Description & Study Details:',
    ...wrapText(resource.description, 75),
    '',
    resource.previewText ? '# Resource Study Notes:' : '',
    ...(resource.previewText ? wrapText(resource.previewText, 75) : []),
    '',
    '# Academic Integrity Pledge:',
    'Shared exclusively for peer education, revision, and academic charity.',
    'Commercial exploitation, plagiarism, and exam cheating are strictly prohibited.',
  ].filter(Boolean);

  const contentLines = [
    'BT',
    '/F1 15 Tf',
    '50 780 Td',
    `(${escapePdfText(title)}) Tj`,
    '/F1 11 Tf',
    '0 -24 Td',
    `(${escapePdfText(subtitle)}) Tj`,
    '/F2 10 Tf',
    '0 -18 Td',
    '(____________________________________________________________________________) Tj',
    '0 -24 Td',
  ];

  for (const line of lines) {
    if (line.startsWith('# ')) {
      contentLines.push('/F1 11 Tf');
      contentLines.push(`0 -20 Td`);
      contentLines.push(`(${escapePdfText(line.substring(2))}) Tj`);
      contentLines.push('/F2 9.5 Tf');
      contentLines.push(`0 -15 Td`);
    } else if (line.startsWith('## ')) {
      contentLines.push('/F1 9.5 Tf');
      contentLines.push(`0 -16 Td`);
      contentLines.push(`(${escapePdfText(line.substring(3))}) Tj`);
      contentLines.push('/F2 9 Tf');
      contentLines.push(`0 -14 Td`);
    } else {
      contentLines.push(`(${escapePdfText(line)}) Tj`);
      contentLines.push(`0 -16 Td`);
    }
  }

  contentLines.push('/F1 8 Tf');
  contentLines.push('50 40 Td');
  contentLines.push('(Peer\'s Charity Academic Network - Verified BAUST Academic Repository) Tj');
  contentLines.push('ET');

  const streamData = contentLines.join('\n');
  const streamLength = new TextEncoder().encode(streamData).length;

  let offset = 0;
  const header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  offset += header.length;

  const obj1 = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
  const offset1 = offset;
  offset += obj1.length;

  const obj2 = `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
  const offset2 = offset;
  offset += obj2.length;

  const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n`;
  const offset3 = offset;
  offset += obj3.length;

  const obj4 = `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamData}\nendstream\nendobj\n`;
  const offset4 = offset;
  offset += obj4.length;

  const obj5 = `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`;
  const offset5 = offset;
  offset += obj5.length;

  const obj6 = `6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;
  const offset6 = offset;
  offset += obj6.length;

  const xrefOffset = offset;
  const xref = [
    'xref',
    '0 7',
    '0000000000 65535 f ',
    `${String(offset1).padStart(10, '0')} 00000 n `,
    `${String(offset2).padStart(10, '0')} 00000 n `,
    `${String(offset3).padStart(10, '0')} 00000 n `,
    `${String(offset4).padStart(10, '0')} 00000 n `,
    `${String(offset5).padStart(10, '0')} 00000 n `,
    `${String(offset6).padStart(10, '0')} 00000 n `,
    'trailer',
    '<< /Size 7 /Root 1 0 R >>',
    'startxref',
    `${xrefOffset}`,
    '%%EOF\n',
  ].join('\n');

  const fullPdf = header + obj1 + obj2 + obj3 + obj4 + obj5 + obj6 + xref;
  const buffer = new Uint8Array(fullPdf.length);
  for (let i = 0; i < fullPdf.length; i++) {
    buffer[i] = fullPdf.charCodeAt(i) & 0xff;
  }

  return new Blob([buffer], { type: 'application/pdf' });
}

function wrapText(text: string, maxLen: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';

  for (const word of words) {
    if ((cur + ' ' + word).trim().length > maxLen) {
      if (cur) lines.push(cur.trim());
      cur = word;
    } else {
      cur = cur ? cur + ' ' + word : word;
    }
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

export interface DownloadResult {
  success: boolean;
  mode: 'external' | 'file' | 'fallback';
  filename?: string;
  error?: string;
}

/**
 * Universal resource download handler
 * - Opens external links in a new tab
 * - Downloads active sample files or remote files
 * - Automatically synthesizes dynamic study sheets if files are unreachable
 * - Synchronizes telemetry with localStorage and backend API
 */
export async function triggerResourceDownload(
  resource: Resource
): Promise<DownloadResult> {
  // 1. External Links handling
  const isExternal =
    resource.academicMetadata?.materialType === 'EXTERNAL_LINK' ||
    resource.resourceType === 'External Link' ||
    (!resource.fileUrl && !!resource.externalUrl);

  const destinationUrl = resource.academicMetadata?.externalLink || resource.externalUrl;

  if (isExternal && destinationUrl) {
    if (typeof window !== 'undefined') {
      window.open(destinationUrl, '_blank', 'noopener,noreferrer');
    }
    // Record telemetry
    recordDownload(resource.id);
    apiRecordDownload(resource.id).catch(() => {});
    return { success: true, mode: 'external' };
  }

  // 2. File Download handling
  const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const defaultExt = resource.fileUrl?.endsWith('.zip')
    ? '.zip'
    : resource.fileUrl?.endsWith('.pptx')
    ? '.pptx'
    : '.pdf';

  const defaultFilename = `${sanitize(resource.courseCode)}_${sanitize(resource.title.slice(0, 32))}${defaultExt}`;
  const filename = resource.fileName || defaultFilename;

  let downloadBlob: Blob | null = null;

  // Try fetching the file if a fileUrl is available
  if (resource.fileUrl && typeof window !== 'undefined') {
    try {
      const res = await fetch(resource.fileUrl);
      if (res.ok) {
        downloadBlob = await res.blob();
      }
    } catch {
      // Fetch failed or blocked by CORS, proceed to dynamic generator
    }
  }

  // Fallback: Generate dynamic study sheet PDF if file is offline/missing
  if (!downloadBlob) {
    try {
      downloadBlob = createStudySheetPdfBlob(resource);
    } catch {
      // Last-resort plain text fallback
      const textContent = `PEER'S CHARITY ACADEMIC STUDY SHEET\n\nCourse: ${resource.courseCode} - ${resource.courseName}\nTitle: ${resource.title}\nBenefactor: ${resource.publicDisplayIdentity}\nDescription: ${resource.description}\nVerification: ${resource.fileHash}`;
      downloadBlob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    }
  }

  // Trigger browser download via object URL
  if (typeof window !== 'undefined' && downloadBlob) {
    const objectUrl = URL.createObjectURL(downloadBlob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }

  // Record telemetry (both local and live backend)
  recordDownload(resource.id);
  apiRecordDownload(resource.id).catch(() => {});

  return {
    success: true,
    mode: resource.fileUrl && downloadBlob ? 'file' : 'fallback',
    filename,
  };
}
