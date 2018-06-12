import { IUser } from "./IUser";
import { Moment } from "moment";

export interface IConversationListItem {
  id: string;
  recipient: string;
  lastMessage: string;
  lastMessageTimestamp: string | number | Moment | Object;
  unread: boolean;
}
