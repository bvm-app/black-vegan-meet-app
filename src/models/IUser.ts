import { Moment } from 'moment';
import { GenderOptions } from '../enums/GenderOptions';
import { IUserPreferences } from './IUserPreferences';
import { RelationshipStatusOptions } from '../enums/RelationshipStatusOptions';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  gender: GenderOptions;
  email: string;

  searchName: string;

  city?: string;
  state?: string;
  country?: string;
  searchAddress?: string;

  birthdate?: string | Moment;

  images?: string[];
  occupation?: string;
  height?: string;
  relationshipStatus?: RelationshipStatusOptions;
  profilePictureUrl?: string;

  preferences?: IUserPreferences;

  lastActive?: number;
}