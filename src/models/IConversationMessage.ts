import { Moment } from 'moment';

export interface IConversationMessage {
  userId: string;
  payload?: string;
  file?: string;
  timestamp: string | number | Object | Moment;
}
