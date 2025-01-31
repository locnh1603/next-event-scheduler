import mongoose, { Document, Schema } from "mongoose";

export class EventModel {
  id: string = '';
  name: string = '';
  description: string = '';
  date: number = 0;
  location: string = '';
  image: string = '';
  status: string = '';
  type: string = '';
  tags: string[] = [];
  active: boolean = true;
}

export class EventDTO {
  name: string = '';
  description: string = '';
  date: number = 0;
  location: string = '';
  image: string = '';
  status: string = '';
  type: string = '';
  tags: string[] = [];
}

export interface IEvent extends Document {
  id: string;
  name: string;
  description: string;
  date: number;
  location: string;
  image: string;
  status: string;
  type: string;
  tags: string[];
  active: boolean;
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
  date: {
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
  }
});

const Event = mongoose.models.events || mongoose.model<IEvent>('events', eventSchema)

export default Event;
