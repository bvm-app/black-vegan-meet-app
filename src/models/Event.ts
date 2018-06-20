
import { Moment } from 'moment';
import { Coordinates } from "./coordinates";


export class Event {
    id?: string;
    name: string;
    image_url?: string;
    images?: any[];    
    description?: string;
    startDateTime: string | Moment;
    endDateTime: string | Moment;
    organizer?: string;
    location?: string;
    slug?: string;
    coordinates: Coordinates = new Coordinates();
    
    constructor(init?:Partial<Event>){
        Object.assign(this, init);
    }

}