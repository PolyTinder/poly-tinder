import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import * as LR from '@uploadcare/blocks';
import { MAX_FILE_SIZE_BYTES, PUBLIC_KEY } from '../../constants/uploadcare';
import { UcWidgetComponent } from 'ngx-uploadcare-widget';
import { BehaviorSubject, Observable, map } from 'rxjs';

LR.registerBlocks(LR);

@Component({
    selector: 'app-image-control',
    templateUrl: './image-control.component.html',
    styleUrls: ['./image-control.component.scss'],
})
export class ImageControlComponent {
    @Input() id: string = '';
    @Input() imageOnly: boolean = true;
    @Input() sources: string =
        'local, url, camera, dropbox, gphotos, instagram';
    @Input() crop: string | undefined;
    @Input() value: BehaviorSubject<string | undefined> = new BehaviorSubject<
        string | undefined
    >(undefined);
    @Output() change = new EventEmitter<string[]>();
    @ViewChild('widget') widget!: ElementRef & { widget: UcWidgetComponent };

    publicKey = PUBLIC_KEY;
    maxFileSizeBytes = MAX_FILE_SIZE_BYTES;

    get url(): Observable<string | undefined> {
        return this.value.pipe(
            map((value) => {
                if (value) {
                    return `${value}-/resize/200x/`;
                }
                return undefined;
            }),
        );
    }

    get urlRetina(): Observable<string | undefined> {
        return this.value.pipe(
            map((value) => {
                if (value) {
                    return `${value}-/resize/400x/`;
                }
                return undefined;
            }),
        );
    }

    openDialog() {
        this.widget.widget.openDialog();
    }

    onUpload(info: any) {
        this.value.next(info.cdnUrl);
        this.change.next(info.cdnUrl);
    }
}
