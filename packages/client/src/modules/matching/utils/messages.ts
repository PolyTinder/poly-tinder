import { Message, MessageGroup } from 'common/models/message';

export const groupMessages = (messages: Message[]): MessageGroup[] => {
    const groupedMessages: MessageGroup[] = [];
    let currentGroup: MessageGroup | undefined = undefined;
    let previousMessage: Message | undefined = undefined;

    for (const message of messages) {
        if (!previousMessage || !isSameGroup(message, previousMessage)) {
            currentGroup = {
                date: message.date,
                senderId: message.senderId,
                messages: [],
            };
            groupedMessages.push(currentGroup);
        }

        currentGroup!.messages.push(message);

        previousMessage = message;
    }

    return groupedMessages;
};

const isSameGroup = (message: Message, previousMessage: Message): boolean => {
    return (
        message.senderId === previousMessage.senderId &&
        message.date.getTime() - previousMessage.date.getTime() < 5 * 60 * 1000
    );
};
