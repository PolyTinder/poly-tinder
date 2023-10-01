import { PublicUserResult } from "./user";

export interface Message {
    content: string;
    timestamp: Date;
    senderId: number;
    recipientId: number;
}

export interface MessageGroup {
    timestamp: Date;
    senderId: number;
    messages: Message[];
}

export type DisplayMessage = Pick<Omit<Message, 'senderId'>, 'content' | 'timestamp'> & {
    sender: Pick<PublicUserResult, 'name' | 'pictures'>;
    onlyEmoji: boolean;
}

export type DisplayMessageGroup = Pick<MessageGroup, 'timestamp'> & {
    sender: Pick<PublicUserResult, 'name'> & { picture: string; };
    messages: DisplayMessage[];
    isSelf: boolean;
}