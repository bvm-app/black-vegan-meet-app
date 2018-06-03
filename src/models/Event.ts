
import { Moment } from 'moment';

export class Event {
    $key: string;
    name: string;
    description: string;
    startDateTime: string | Moment;
    endDateTime: string | Moment;
    organizer: string;
    location: string;
}