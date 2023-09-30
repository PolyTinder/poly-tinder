import { UploadcareFile } from "./image";

export interface UploadcareEvent extends Event {
    detail: {
        ctxName: string;
        data: UploadcareFile[];
        timestamp: number;
    }
}