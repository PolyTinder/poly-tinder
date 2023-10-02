interface LayoutActionContent {
    content: string;
    icon?: string;
}

interface LayoutActionIcon {
    content?: string;
    icon: string;
}

export type LayoutAction = (LayoutActionContent | LayoutActionIcon) & {
    link?: string;
    action?: () => void;
};
