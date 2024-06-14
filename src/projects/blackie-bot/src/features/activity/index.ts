import { LocationName } from './LocationName';

interface Reminder {
  startDate: Date;
  label: string;
  repeat: {
    interval: number;
    unit: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  };
}

interface Activity<T = unknown> {
  location: LocationName;
  name: string;
  startDate: Date;
  messageId?: string;
  endDate?: Date;
  canceled?: boolean;
  data: T;
}
