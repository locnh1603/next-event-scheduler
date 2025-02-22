'use client'
import {Card, CardContent} from '@/components/card';
import {Input} from '@/components/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/select';
import {Button} from '@/components/button';
import React, { useState } from 'react';
import {useRouter} from 'next/navigation';

interface EventFilterProps {
  search: string;
  type: string;
}

const EventFilter = (props: EventFilterProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {search, type} = props;
  const filterEvents = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchInput = formData.get('search');
    const typeInput = formData.get('type');
    const params = new URLSearchParams();
    params.set('page', '1');
    if (searchInput) params.set('search', searchInput.toString());
    if (typeInput) params.set('type', typeInput.toString());
    router.push(`/events/all?${params.toString()}`);
    setTimeout(() => setLoading(false), 1000);
  };
  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={filterEvents}>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search events..."
                defaultValue={search}
                className="w-full"
                name="search"
              />
            </div>
            <Select name="type" defaultValue={type || 'all'}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="invite">Invite Only</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className={`flex items-center gap-2 ${loading ? 'disabled' : ''}`} disabled={loading} type="submit">
              Apply
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default EventFilter;
