import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import EventList from './page';
import { EventModel } from '@/models/event.model';
import { UserModel } from '@/models/user.model';

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    toString: () => 'mock-cookie'
  }))
}));

vi.mock('@/app/events/event-card', () => ({
  default: ({ event, user }: { event: EventModel; user: UserModel }) => (
    <div data-testid="event-card">
      {event.name} - {user.name}
    </div>
  )
}));

vi.mock('@/app/events/all/event-filter', () => ({
  default: ({ search, type }: { search: string; type: string }) => (
    <div data-testid="event-filter">
      Filter: {search} - {type}
    </div>
  )
}));

vi.mock('@/app/events/all/event-pagination', () => ({
  default: ({ currentPage, totalPages, totalCount }: {
    currentPage: number;
    totalPages: number;
    totalCount: number
  }) => (
    <div data-testid="event-pagination">
      Page {currentPage} of {totalPages} (Total: {totalCount})
    </div>
  )
}));

describe('EventList', () => {
  const mockEvents: EventModel[] = [
    {
      id: '1',
      name: 'Test Event 1',
      createdBy: '101',
      startDate: new Date(),
    },
    {
      id: '2',
      name: 'Test Event 2',
      createdBy: '102',
      startDate: new Date(),
    }
  ];

  const mockUsers: UserModel[] = [
    {
      id: '101',
      name: 'User 1',
      email: 'test@gmail.com',
      emailVerified: new Date(),
      image: '',
    },
    {
      id: '102',
      name: 'User 2',
      email: 'test@gmail.com',
      emailVerified: new Date(),
      image: '',
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock global fetch
    global.fetch = vi.fn()
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({
          payload: {
            events: mockEvents,
            totalCount: 2,
            totalPages: 1,
            currentPage: 1
          }
        })
      }))
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({
          payload: mockUsers
        })
      }));
  });

  it('should render event list with all components', async () => {
    const searchParams = Promise.resolve({
      page: '1',
      search: 'test',
      type: 'all'
    });

    const { container } = render(await EventList({ searchParams }));

    // Check if main components are rendered
    expect(screen.getByTestId('event-filter')).toBeInTheDocument();
    expect(screen.getAllByTestId('event-card')).toHaveLength(2);
    expect(screen.getByTestId('event-pagination')).toBeInTheDocument();
  });

  it('should make correct API calls', async () => {
    const searchParams = Promise.resolve({
      page: '1',
      search: 'test',
      type: 'all'
    });

    await EventList({ searchParams });

    // Check first API call (events)
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      `${process.env.NEXT_PUBLIC_API_URL}/events`,
      expect.objectContaining({
        method: 'POST',
        headers: {
          Cookie: 'mock-cookie'
        },
        body: expect.stringContaining('"command":"filterEvents"')
      })
    );

    // Check second API call (users)
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"command":"getUsers"')
      })
    );
  });

  it('should handle empty search params', async () => {
    const searchParams = Promise.resolve({});

    render(await EventList({ searchParams }));

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('"page":1')
      })
    );
  });

  it('should match events with corresponding users', async () => {
    const searchParams = Promise.resolve({});

    render(await EventList({ searchParams }));

    const eventCards = screen.getAllByTestId('event-card');
    expect(eventCards[0]).toHaveTextContent('Test Event 1 - User 1');
    expect(eventCards[1]).toHaveTextContent('Test Event 2 - User 2');
  });

  it('should handle API errors', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('API Error'));

    const searchParams = Promise.resolve({});

    await expect(EventList({ searchParams })).rejects.toThrow('API Error');
  });

  it('should pass correct props to EventFilter', async () => {
    const searchParams = Promise.resolve({
      search: 'test-search',
      type: 'test-type'
    });

    render(await EventList({ searchParams }));

    const filter = screen.getByTestId('event-filter');
    expect(filter).toHaveTextContent('Filter: test-search - test-type');
  });

  it('should pass correct props to EventPagination', async () => {
    const searchParams = Promise.resolve({
      page: '2'
    });

    render(await EventList({ searchParams }));

    const pagination = screen.getByTestId('event-pagination');
    expect(pagination).toHaveTextContent('Page 1 of 1 (Total: 2)');
  });
});
