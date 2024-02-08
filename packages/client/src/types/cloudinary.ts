export interface CloudinaryWidget {
    open(): void;
    close(): void;
    show(): void;
}

export type CloudinaryWidgetSourceType =
    | 'local'
    | 'url'
    | 'camera'
    | 'dropbox'
    | 'image_search'
    | 'shutterstock'
    | 'gettyimages'
    | 'istock'
    | 'unsplash'
    | 'google_drive';

export interface CloudinaryWidgetEvent {
    event: string;
    info: object;
}

export interface CloudinaryWidgetEventUploadAdded
    extends CloudinaryWidgetEvent {
    event: 'upload-added';
    info: {
        id: string;
        publicId: string;
        file: {
            lastModified: number;
            lastModifiedDate: string;
            name: string;
            size: number;
            type: string;
        };
    };
}

export interface CloudinaryWidgetEventSuccess extends CloudinaryWidgetEvent {
    event: 'success';
    info: {
        id: string;
        asset_id: string;
        bytes: number;
        create_at: string;
        etag: string;
        folder: string;
        format: string;
        height: number;
        path: string;
        public_id: string;
        resource_type: 'image' | 'video';
        secure_url: string;
        signature: string;
        tags: string[];
        thumbnail_url: string;
        url: string;
        version: number;
        version_id: string;
        width: number;
    };
}

export interface CloudinaryWidgetEventClose extends CloudinaryWidgetEvent {
    event: 'close';
    info: {
        message: string;
    };
}
