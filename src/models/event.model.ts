import mongoose, { Document, Schema } from "mongoose";

export class EventModel {
  id: string = '';
  name: string = '';
  description: string = '';
  startDate: number = 0;
  endDate: number = 0;
  location: string = '';
  image: string = '';
  status: string = '';
  type: string = '';
  tags: string[] = [];
  createdBy: string = '';
  active: boolean = true;
}

export class EventDTO {
  name: string = '';
  description: string = '';
  startDate: number = 0;
  endDate: number = 0;
  location: string = '';
  image: string = '';
  type: string = '';
  tags: string[] = [];
  constructor(data: Partial<EventDTO>) {
    Object.assign(this, data);
  }
}

export interface GetEventsDTO {
  ids?: string[];
}

export interface IEvent extends Document {
  id: string;
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  location: string;
  image: string;
  status: string;
  type: string;
  tags: string[];
  active: boolean;
  createdBy: string;
}

const eventSchema: Schema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  startDate: {
    type: Number,
    required: true
  },
  endDate: {
    type: Number,
    required: true
  },
  location: {
    type: String
  },
  image: {
    type: String
  },
  status: {
    type: String
  },
  type: {
    type: String
  },
  tags: {
    type: [String]
  },
  active: {
    type: Boolean
  },
  createdBy: {
    type: String
  },
  interested: {
    type: Number,
    required: true,
    default: 0
  }
});

const Event = mongoose.models?.events || mongoose.model<IEvent>('events', eventSchema)

export default Event;
