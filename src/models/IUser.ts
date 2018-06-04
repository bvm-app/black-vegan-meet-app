import { Moment } from 'moment';
import { GenderOptions } from '../enums/GenderOptions';
import { IUserPreferences } from './IUserPreferences';
import { RelationshipStatusOptions } from '../enums/RelationshipStatusOptions';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  birthdate: string | Moment;
  gender: GenderOptions;
  email: string;
  address: string;
  searchName: string;

  images?: string[];
  occupation?: string;
  height?: string;
  relationshipStatus?: RelationshipStatusOptions;
  profilePictureUrl?: string;

  preferences?: IUserPreferences;
}
