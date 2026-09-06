import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResourceFilterBar from './ResourceFilterBar';

// Mock next/navigation
const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();
let mockPathname = '/bazaar';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: vi.fn(),
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

describe('Phase 3: Frontend Component Tests — ResourceFilterBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    mockPathname = '/bazaar';
  });

  it('1. Renders default section tabs correctly', () => {
    render(<ResourceFilterBar />);

    expect(screen.getByRole('tab', { name: /all sections/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /question archive/i })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: /course materials/i })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: /sessional \/ lab/i })).toHaveAttribute('aria-selected', 'false');

    // Sub-filters should NOT be present initially
    expect(screen.queryByRole('region', { name: /exam type filters/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: /material type filters/i })).not.toBeInTheDocument();
  });

  it('2. Switching section tab dynamically pushes/updates query string without hard reload', async () => {
    const user = userEvent.setup();
    const handleFilterChange = vi.fn();
    render(<ResourceFilterBar onFilterChange={handleFilterChange} />);

    // Click "Question Archive"
    await user.click(screen.getByRole('tab', { name: /question archive/i }));

    expect(mockReplace).toHaveBeenCalledWith('/bazaar?section=question', { scroll: false });
    expect(handleFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ section: 'question' })
    );
  });

  it('3. Renders Exam Type sub-filters when Question section is active in searchParams', async () => {
    mockSearchParams = new URLSearchParams('section=question');
    const user = userEvent.setup();
    render(<ResourceFilterBar />);

    // Exam type buttons appear
    expect(screen.getByRole('region', { name: /exam type filters/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CT' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'MID' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'FINAL' })).toBeInTheDocument();

    // Select "CT"
    await user.click(screen.getByRole('button', { name: 'CT' }));

    expect(mockReplace).toHaveBeenCalledWith('/bazaar?section=question&examType=CT', { scroll: false });
  });

  it('4. Renders Material Type sub-filters when Course Material section is active', async () => {
    mockSearchParams = new URLSearchParams('section=course_material');
    const user = userEvent.setup();
    render(<ResourceFilterBar />);

    expect(screen.getByRole('region', { name: /material type filters/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hand notes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /slides/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /external links/i })).toBeInTheDocument();

    // Select "Slides"
    await user.click(screen.getByRole('button', { name: /slides/i }));

    expect(mockReplace).toHaveBeenCalledWith('/bazaar?section=course_material&materialType=SLIDES', { scroll: false });
  });

  it('5. CRITICAL: Automatically clears sub-filters (e.g. examType) when switching section to Sessional', async () => {
    // Current URL has section=question and examType=CT
    mockSearchParams = new URLSearchParams('section=question&examType=CT');
    const user = userEvent.setup();
    const handleFilterChange = vi.fn();
    render(<ResourceFilterBar onFilterChange={handleFilterChange} />);

    // Switch to "Sessional / Lab"
    await user.click(screen.getByRole('tab', { name: /sessional \/ lab/i }));

    // Should push /bazaar?section=sessional and completely omit examType
    expect(mockReplace).toHaveBeenCalledWith('/bazaar?section=sessional', { scroll: false });
    expect(handleFilterChange).toHaveBeenCalledWith({
      section: 'sessional',
      examType: undefined,
      materialType: undefined,
      batch: undefined,
    });
  });
});
