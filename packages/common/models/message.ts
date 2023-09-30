import { PublicUserResult } from "./user";

export interface Message {
    content: string;
    date: Date;
    senderId: number;
}

export interface MessageGroup {
    date: Date;
    senderId: number;
    messages: Message[];
}

export type DisplayMessage = Pick<Omit<Message, 'senderId'>, 'content' | 'date'> & {
    sender: Pick<PublicUserResult, 'name' | 'pictures'>;
}

export type DisplayMessageGroup = Pick<MessageGroup, 'date'> & {
    sender: Pick<PublicUserResult, 'name'> & { picture: string; };
    messages: DisplayMessage[];
    isSelf: boolean;
}