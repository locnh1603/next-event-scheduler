import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EventPagination from './event-pagination';

vi.mock('@/components/pagination', () => ({
  Pagination: ({ children }: { children: React.ReactNode }) => <div data-testid="pagination">{children}</div>,
  PaginationContent: ({ children }: { children: React.ReactNode }) => <div data-testid="pagination-content">{children}</div>,
  PaginationEllipsis: () => <span data-testid="pagination-ellipsis">...</span>,
  PaginationItem: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="pagination-item" className={className}>
      {children}
    </div>
  ),
  PaginationLink: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a data-testid="pagination-link" href={href}>
      {children}
    </a>
  ),
  PaginationNext: ({ href }: { href: string }) => <a data-testid="pagination-next" href={href}>Next</a>,
  PaginationPrevious: ({ href }: { href: string }) => <a data-testid="pagination-previous" href={href}>Previous</a>,
}));
vi.mock('@/utilities/array-util', () => ({
  generateNumberArray: (start: number, end: number) => {
    const array = [];
    for (let i = start; i <= end; i++) {
      array.push(i);
    }
    return array;
  },
}));
vi.mock('@/models/event.model', () => ({
  EventModel: vi.fn(),
}));

describe('EventPagination Component', () => {
  const mockProps = {
    currentPage: 3,
    totalPages: 10,
    totalCount: 100,
    searchParams: 'category=music',
    events: Array(10).fill({ id: 1, name: 'Event' }),
  };

  it('renders the pagination component', () => {
    render(<EventPagination {...mockProps} />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('displays the correct number of events', () => {
    render(<EventPagination {...mockProps} />);
    expect(screen.getByText(/Showing 10 out of 100 events/i)).toBeInTheDocument();
  });

  it('renders the correct page numbers', () => {
    render(<EventPagination {...mockProps} />);
    const pageLinks = screen.getAllByTestId('pagination-link');
    expect(pageLinks.length).toBe(5); // Should display 5 page links
    expect(pageLinks[0]).toHaveTextContent('1');
    expect(pageLinks[4]).toHaveTextContent('5');
  });

  it('disables the previous button on the first page', () => {
    render(<EventPagination {...mockProps} currentPage={1} />);
    const previousButton = screen.getByTestId('pagination-previous').closest('div');
    expect(previousButton).toHaveClass('disabled');
  });

  it('disables the next button on the last page', () => {
    render(<EventPagination {...mockProps} currentPage={10} />);
    const nextButton = screen.getByTestId('pagination-next').closest('div');
    expect(nextButton).toHaveClass('disabled');
  });

  it('renders ellipsis when totalPages > 5', () => {
    render(<EventPagination {...mockProps} />);
    expect(screen.getByTestId('pagination-ellipsis')).toBeInTheDocument();
  });

  it('does not render ellipsis when totalPages <= 5', () => {
    render(<EventPagination {...mockProps} totalPages={5} />);
    expect(screen.queryByTestId('pagination-ellipsis')).not.toBeInTheDocument();
  });
});
