import { Types } from 'mongoose';
import Event from '@/models/event.model';
import { subDays } from 'date-fns';
import { v4 } from 'uuid';
import type {
  EventDTO,
  FilterEventsDTO,
  EditEventDetailsDTO,
} from '@/models/event.model';
import {AppError} from '@/utilities/error-handler';
import { ApiError } from '@/app/api/api-error-handler';

class EventService {
  async getEvents(ids?: string[]) {
    const query = { active: true };
    if (ids?.length) {
      return Event.find(query).where('id').in(ids);
    }
    return Event.find(query);
  }

  async filterEvents({
                       searchParam,
                       page,
                       limit,
                       sortField,
                       sortOrder,
                       filter,
                       createdBy,
                     }: FilterEventsDTO & { createdBy: string }) {
    const skip = (page - 1) * limit;
    const query = {
      name: { $regex: searchParam || '', $options: 'i' },
      type: {
        $regex: filter.type ? (filter.type === 'all' ? '' : filter.type) : '',
        $options: 'i',
      },
      createdBy,
    };

    const [events, totalCount] = await Promise.all([
      Event.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Event.countDocuments(query),
    ]);

    return {
      events,
      count: events.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }

  async createEvent(eventData: EventDTO, createdBy: Types.ObjectId) {
    return Event.create({
      ...eventData,
      id: v4(),
      active: true,
      status: 'Pending',
      createdBy,
    });
  }

  async getDashboardEvents(createdBy?: Types.ObjectId) {
    const yesterdayTimestamp = subDays(new Date(), 1).getTime();
    const [hotEvents, recentEvents] = await Promise.all([
      Event.find({ interested: { $gt: 10 } }).limit(6),
      Event.find({ startDate: { $gt: yesterdayTimestamp } }).limit(6),
    ]);
    const myEvents = createdBy ? await Event.find({ createdBy }).limit(6) : [];
    return { myEvents, hotEvents, recentEvents };
  }

  async updateEventDetails({ id, name, description }: EditEventDetailsDTO) {
    const event = await Event.findOneAndUpdate(
      { id },
      { name, description },
      { new: true }
    );
    if (!event) {
      throw new ApiError(404,'Event not found');
    }
    return event;
  }

  async joinEvent(id: string, userId: Types.ObjectId) {
    const event = await Event.findOneAndUpdate(
      { id },
      { $addToSet: { participants: userId } },
      { new: true }
    );
    if (!event) {
      throw new ApiError(404,'Event not found');
    }
    return event;
  }

  async getParticipants(id: string) {
    const event = await Event.findOne({ id });
    if (!event) {
      throw new ApiError(404,'Event not found');
    }
    return event.participants;
  }
}

export const eventService = new EventService();
