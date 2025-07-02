'use client';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/shadcn-ui/pagination';
import React from 'react';
import { generateNumberArray } from '@/utilities/array-util';
import { Event } from '@/models/event.model';

interface EventPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  searchParams: string;
  events: Event[];
}

const EventPagination = (props: EventPaginationProps) => {
  const { currentPage, totalPages, totalCount, searchParams, events } = props;
  const getPageToDisplay = () => {
    let pageToDisplay: number[] = [];
    if (totalPages < currentPage) {
      pageToDisplay = generateNumberArray(1, currentPage).slice(-5);
    } else if (totalPages <= 5) {
      pageToDisplay = generateNumberArray(1, totalPages);
    } else if (currentPage <= 2) {
      pageToDisplay = generateNumberArray(1, 5);
    } else if (currentPage + 2 >= totalPages) {
      const firstPage = totalPages - 4;
      pageToDisplay = generateNumberArray(firstPage, totalPages);
    } else {
      const firstPage = currentPage - 2;
      const lastPage = currentPage + 2;
      pageToDisplay = generateNumberArray(firstPage, lastPage);
    }
    return pageToDisplay;
  };
  return (
    <Pagination className="justify-between">
      <p className="text-sm flex items-center justify-center">
        Showing {events.length} out of {totalCount} events
      </p>
      <PaginationContent>
        <PaginationItem className={currentPage <= 1 ? 'disabled' : ''}>
          <PaginationPrevious href="#" />
        </PaginationItem>
        {getPageToDisplay().map((page) => {
          const params = new URLSearchParams(searchParams);
          params.set('page', page.toString());
          const pageUrl = `/events/all?${params.toString()}`;
          return (
            <PaginationItem key={page}>
              <PaginationLink href={pageUrl}>{page}</PaginationLink>
            </PaginationItem>
          );
        })}
        {totalPages > 5 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem className={currentPage >= totalPages ? 'disabled' : ''}>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default EventPagination;
