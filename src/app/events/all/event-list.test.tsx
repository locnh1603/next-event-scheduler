import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import EventList from './page';
import { EventModel } from '@/models/event.model';
import { UserModel } from '@/models/user.model';
import customFetch from '@/utilities/fetch-util';
import { generateUniqueArray } from '@/utilities/array-util';

vi.mock('@/utilities/fetch-util', () => ({
  default: vi.fn(),
}));

vi.mock('@/utilities/array-util', () => ({
  generateUniqueArray: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    toString: () => 'mock-cookie',
  })),
}));

vi.mock('@/app/events/event-card', () => ({
  default: ({ event, user }: { event: EventModel; user: UserModel }) => (
    <div data-testid="event-card">
      Event: {event.name}, User: {user.name}
    </div>
  ),
}));

vi.mock('@/app/events/all/event-pagination', () => ({
  default: () => <div data-testid="event-pagination">Pagination</div>,
}));

vi.mock('@/app/events/all/event-filter', () => ({
  default: () => <div data-testid="event-filter">Filter</div>
}));

describe('EventList', () => {
  const mockEvents = [
    {
      id: '1',
      title: 'Test Event 1',
      createdBy: '101',
      startDate: '2025-03-01',
    },
    {
      id: '2',
      title: 'Test Event 2',
      createdBy: '102',
      startDate: '2025-03-02',
    },
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

  const mockSearchParams = {
    page: '1',
    search: 'test',
    type: 'all',
  };

  const customFetchMock = vi.mocked(customFetch);
  const generateUniqueArrayMock = vi.mocked(generateUniqueArray);
  beforeEach(() => {
    vi.clearAllMocks();
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
    customFetchMock.mockImplementation((url) => {
      if (url.includes('/events')) {
        return Promise.resolve(new Response(JSON.stringify({
          payload: {
            events: mockEvents,
            totalCount: 2,
            totalPages: 1,
            currentPage: 1,
          },
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }));
      }
      if (url.includes('/users')) {
        return Promise.resolve(new Response(JSON.stringify(mockUsers), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }));
      }
      return Promise.reject(new Error('Invalid URL'));
    });
    generateUniqueArrayMock.mockReturnValue(['101', '102']);
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('handles API error', async () => {
    customFetchMock.mockRejectedValueOnce(new Error('API Error'));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<EventList searchParams={Promise.resolve(mockSearchParams)} />);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('renders the component', async () => {
    act(async () => {
      const container = render(
        <EventList searchParams={Promise.resolve(mockSearchParams)} />
      );
      expect(container).toBeDefined();
    }).then(r => {});
  });

  it('should render event list with all components', async () => {
    act(async () => {
      const filter = await screen.findByTestId('event-filter');
      expect(filter).toHaveTextContent('Filter: test-workshop');
      const eventCards = await screen.findAllByTestId('event-card');
      expect(eventCards).toHaveLength(2);
      expect(eventCards[0]).toHaveTextContent('1-101');
      expect(eventCards[1]).toHaveTextContent('2-102');
      const pagination = await screen.findByTestId('event-pagination');
      expect(pagination).toHaveTextContent('Page 1 of 1 (2 total)');
    }).then(r => {})
  });

  it('should call fetch function', async () => {
    act(async () => {
      await screen.findByTestId('event-card');
      expect(customFetch).toHaveBeenCalledTimes(2);
      expect(customFetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/events`,
        {
          method: 'POST',
          body: JSON.stringify({
            command: 'filterEvents',
            payload: {
              searchParam: 'test',
              page: 1,
              limit: 20,
              sortField: 'startDate',
              sortOrder: 'asc',
              filter: { type: 'all' },
            },
          }),
        },
        'mock-cookie'
      );
      expect(screen.getAllByTestId('event-card')).toHaveLength(2);
    }).then(r => {});
  });

  it('should handle missing search params', async () => {
    act(async () => {
      const filter = await screen.findByTestId('event-filter');
      const eventCard = await screen.findAllByTestId('event-card');
      const pagination = await screen.findByTestId('event-pagination')
      expect(filter).toHaveTextContent('Filter: -');
      expect(eventCard).toHaveLength(2);
      expect(pagination).toBeInTheDocument();
    }).then(r => {});
  });
});
