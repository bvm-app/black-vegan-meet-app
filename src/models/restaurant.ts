import { Coordinates } from "./coordinates";

export class Restaurant {
    id: string;
    name: string;
    image_url?: string;
    coordinates: Coordinates = new Coordinates();
    images?: any[];
    distance?: number;
    description?: string;
    isAppRestaurant: boolean;
}