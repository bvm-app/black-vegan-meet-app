import { Coordinates } from "./coordinates";

export class GroceryStore {
    id: string;
    name: string;
    image_url?: string;
    coordinates: Coordinates = new Coordinates();
    images?: any[];
    distance?: number;
}