import { Moment } from 'moment';
import { GenderOptions } from '../enums/GenderOptions';
import { IUserPreferences } from './IUserPreferences';
import { RelationshipStatusOptions } from '../enums/RelationshipStatusOptions';
import { Coordinates } from './coordinates';

export interface IUser {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  gender?: GenderOptions;
  email: string;

  searchName: string;

  city?: string;
  state?: string;
  country?: string;
  searchAddress?: string;
  geolocation?: Coordinates;

  birthdate?: string | Moment;

  images?: string[];
  occupation?: string;
  height?: string;
  relationshipStatus?: RelationshipStatusOptions;
  profilePictureUrl?: string;

  preferences?: IUserPreferences;

  createdAt?: number;
  lastActive?: number;

  premiumSubscriptionExpiry?: string | Moment;

  aboutMe?: string;
}
