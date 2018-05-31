import { Moment } from 'moment';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  birthdate: string | Moment;
  email: string;
  address: string;
  searchName: string;
  profilePictureUrl: string;
}
