import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DonateModal from './DonateModal';

describe('Phase 3: Frontend Component Tests — DonateModal', () => {
  it('1. Dynamic Section Switcher: displays default state with common fields', () => {
    render(<DonateModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);

    // Common fields
    expect(screen.getByLabelText(/course id \/ code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^batch$/i)).toBeInTheDocument();

    // Default is Question Archive:
    expect(screen.getByLabelText(/semester/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CT' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'MID' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'FINAL' })).toBeInTheDocument();

    // Material Type and Lab Number absent in Question section
    expect(screen.queryByLabelText(/material type/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/lab number/i)).not.toBeInTheDocument();
  });

  it('1. Dynamic Section Switcher: Selecting "Course Materials" shows Material Type and dynamic URL input for External Link', async () => {
    const user = userEvent.setup();
    render(<DonateModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);

    // Click "Course Materials"
    await user.click(screen.getByRole('radio', { name: /course materials/i }));

    // Asserts Material Type appears
    const materialSelect = screen.getByLabelText(/material type/i);
    expect(materialSelect).toBeInTheDocument();

    // Exam Type and Lab Number absent
    expect(screen.queryByRole('button', { name: 'CT' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/lab number/i)).not.toBeInTheDocument();

    // Select "External Link"
    await user.selectOptions(materialSelect, 'EXTERNAL_LINK');

    // Asserts URL input field dynamically renders
    expect(screen.getByLabelText(/external url/i)).toBeInTheDocument();
  });

  it('1. Dynamic Section Switcher: Selecting "Sessional / Lab" hides semester requirement and renders Lab Number / Topic', async () => {
    const user = userEvent.setup();
    render(<DonateModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);

    // Click "Sessional / Lab"
    await user.click(screen.getByRole('radio', { name: /sessional \/ lab/i }));

    // Semester required input is absent
    expect(screen.queryByLabelText(/^semester$/i)).not.toBeInTheDocument();

    // Lab Number and Topic appear
    expect(screen.getByLabelText(/lab number \/ task/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/topic/i)).toBeInTheDocument();
  });

  it('2. Client-Side Form Validation: Submitting empty form shows accessibility-compliant errors (aria-invalid="true")', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<DonateModal isOpen={true} onClose={vi.fn()} onSubmit={handleSubmit} />);

    // Submit empty form
    await user.click(screen.getByRole('button', { name: /submit resource/i }));

    // Handler should NOT be called
    expect(handleSubmit).not.toHaveBeenCalled();

    // Inputs should have aria-invalid="true"
    const courseInput = screen.getByLabelText(/course id \/ code/i);
    const batchInput = screen.getByLabelText(/^batch$/i);

    expect(courseInput).toHaveAttribute('aria-invalid', 'true');
    expect(batchInput).toHaveAttribute('aria-invalid', 'true');

    // Error text is present in the DOM
    expect(screen.getByText(/course id is required/i)).toBeInTheDocument();
    expect(screen.getByText(/batch is required/i)).toBeInTheDocument();
  });

  it('2. Form Submission: Simulating user fill for Sessional item submits exact payload', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<DonateModal isOpen={true} onClose={vi.fn()} onSubmit={handleSubmit} />);

    // Switch to Sessional
    await user.click(screen.getByRole('radio', { name: /sessional \/ lab/i }));

    // Fill fields
    await user.type(screen.getByLabelText(/course id \/ code/i), 'CSE 2104');
    await user.type(screen.getByLabelText(/^batch$/i), '11');
    await user.type(screen.getByLabelText(/lab number \/ task/i), 'Lab 02');
    await user.type(screen.getByLabelText(/topic/i), 'Socket Programming');

    // Submit
    await user.click(screen.getByRole('button', { name: /submit resource/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      section: 'sessional',
      courseId: 'CSE 2104',
      batch: '11',
      labNumber: 'Lab 02',
      topic: 'Socket Programming',
    });
  });
});
