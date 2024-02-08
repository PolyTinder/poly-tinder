import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
    CloudinaryWidget,
    CloudinaryWidgetEvent,
    CloudinaryWidgetEventSuccess,
    CloudinaryWidgetSourceType,
} from 'src/types/cloudinary';

@Component({
    selector: 'app-image-control',
    templateUrl: './image-control.component.html',
    styleUrls: ['./image-control.component.scss'],
})
export class ImageControlComponent implements OnInit {
    @Input() value: BehaviorSubject<string | undefined> = new BehaviorSubject<
        string | undefined
    >(undefined);
    @Input() canDelete: boolean = true;
    @Input() sources: CloudinaryWidgetSourceType[] = [
        'local',
        'camera',
        'dropbox',
        'google_drive',
    ];
    @Output() change = new EventEmitter<string | undefined>();

    uploadWidget: CloudinaryWidget | undefined;
    loading$ = new BehaviorSubject<boolean>(false);

    ngOnInit(): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.uploadWidget = (window as any).cloudinary.createUploadWidget(
            {
                cloudName: 'dofjtcdow',
                uploadPreset: 'profile_picture',
                sources: this.sources,
                multiple: false,
            },
            this.onImageUpdate.bind(this),
        );
    }

    openWidget() {
        if (!this.uploadWidget) return;

        this.uploadWidget.open();
    }

    deleteImage() {
        this.value.next(undefined);
        this.change.next(undefined);
    }

    private onImageUpdate(
        error: object | undefined,
        result: CloudinaryWidgetEvent | undefined,
    ) {
        if (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return;
        }

        if (result) {
            switch (result.event) {
                case 'upload-added':
                    this.handleImageUploadStart();
                    break;
                case 'success':
                    this.handleImageUploadComplete(
                        result as CloudinaryWidgetEventSuccess,
                    );
                    break;
            }
        }
    }

    private handleImageUploadStart() {
        this.value.next(undefined);
        this.loading$.next(true);
    }

    private handleImageUploadComplete(event: CloudinaryWidgetEventSuccess) {
        this.value.next(event.info.public_id);
        this.change.next(event.info.public_id);
        this.loading$.next(false);
    }
}
