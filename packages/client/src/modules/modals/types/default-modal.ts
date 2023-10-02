export interface DefaultModalButtonParameters {
    content: string;
    closeDialog?: boolean;
    action?: () => void;
    redirect?: string;
    icon?: string;
    key?: string;
    color?: boolean;
}

export interface DefaultModalParameters {
    title: string;
    content?: string;
    buttons?: DefaultModalButtonParameters[];
}
