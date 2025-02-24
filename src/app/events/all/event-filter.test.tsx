import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import EventFilter from './event-filter';
import { Router } from 'next/router';
import React from 'react';

// Mock the `next/navigation` module
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: (): Partial<Router> => ({
    push: mockPush,
  }),
}));

// Mock components used in the `EventFilter` component
vi.mock('@/components/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div data-testid="card-content">{children}</div>,
}));

vi.mock('@/components/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input data-testid="input" {...props} />,
}));

vi.mock('@/components/select', () => ({
  Select: ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select data-testid="select" {...props}>
      {children}
    </select>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <>
      <option data-testid="select-content">{children}</option>
    </>
  ),
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <option data-testid="select-trigger">{children}</option>,
  SelectValue: ({ placeholder }: { placeholder: string }) => <option>{placeholder}</option>,
}));

vi.mock('@/components/button', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

describe('EventFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it('renders with default props', () => {
    render(<EventFilter search="" type="" />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('input')).toBeInTheDocument();
    expect(screen.getByTestId('select')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toBeInTheDocument();
  });

  it('renders with provided search and type values', () => {
    render(<EventFilter search="test event" type="public" />);

    const input = screen.getByTestId('input') as HTMLInputElement;
    expect(input.value).toBe('test event');

    const select = screen.getByTestId('select') as HTMLSelectElement;
    expect(select.value).toBe('public');
  });

  it('handles form submission with search and type', () => {
    render(<EventFilter search="" type="" />);

    const form = screen.getByTestId('card-content').querySelector('form') as HTMLFormElement;
    const input = screen.getByTestId('input') as HTMLInputElement;
    const select = screen.getByTestId('select') as HTMLSelectElement;

    fireEvent.change(input, { target: { value: 'new event' } });
    fireEvent.change(select, { target: { value: 'public' } });

    fireEvent.submit(form);

    expect(mockPush).toHaveBeenCalledWith('/events/all?page=1&search=new+event&type=public');
  });

  it('handles form submission with empty values', () => {
    render(<EventFilter search="" type="" />);

    const form = screen.getByTestId('card-content').querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);

    expect(mockPush).toHaveBeenCalledWith('/events/all?page=1&type=all');
  });

  it('sets loading state during form submission', () => {
    render(<EventFilter search="" type="" />);

    const form = screen.getByTestId('card-content').querySelector('form') as HTMLFormElement;
    const button = screen.getByTestId('button') as HTMLButtonElement;

    fireEvent.submit(form);

    expect(button).toBeDisabled();
  });

  it('renders all type options', () => {
    render(<EventFilter search="" type="" />);

    const select = screen.getByTestId('select') as HTMLSelectElement;

    expect(select).toHaveTextContent('All');
    expect(select).toHaveTextContent('Public');
    expect(select).toHaveTextContent('Invite Only');
  });
});
