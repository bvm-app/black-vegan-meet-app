import { Moment } from 'moment';
import { GenderOptions } from '../enums/GenderOptions';
import { IUserPreferences } from './IUserPreferences';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  birthdate: string | Moment;
  gender: GenderOptions;
  email: string;
  address: string;
  searchName: string;
  profilePictureUrl?: string;

  preferences?: IUserPreferences;
}
