import { Component, Input } from '@angular/core';

interface ImageSizeFixed {
    height: number;
    width: number;
}

interface ImageSizeWidth {
    width: number;
    ratio: number;
}

interface ImageSizeHeight {
    height: number;
    ratio: number;
}

interface ImageSizeSquare {
    square: number;
}

type ImageSize =
    | ImageSizeFixed
    | ImageSizeWidth
    | ImageSizeHeight
    | ImageSizeSquare;

@Component({
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss'],
})
export class ImageComponent {
    @Input() src: string | undefined | null = null;
    @Input() alt: string | null = null;
    @Input() size: ImageSize | null = null;
    @Input() inferSize: boolean = false;

    getSrc(scale: number = 1): string | undefined | null {
        return (
            this.src &&
            `${this.src}-/scale_crop/${this.getSizeString(scale)}/smart/`
        );
    }

    getSrcset(): string | undefined | null {
        return (
            this.src &&
            `${this.src}-/scale_crop/${this.getSizeString(0.5)}/smart/ 0.5x, ${
                this.src
            }-/scale_crop/${this.getSizeString(1)}/smart/ 1x, ${
                this.src
            }-/scale_crop/${this.getSizeString(2)}/smart/ 2x`
        );
    }

    get width(): number | null {
        if (!this.size) {
            return null;
        }

        if ('width' in this.size) {
            return this.size.width;
        }

        if ('height' in this.size) {
            return this.size.height * this.size.ratio;
        }

        if ('square' in this.size) {
            return this.size.square;
        }

        return null;
    }

    get height(): number | null {
        if (!this.size) {
            return null;
        }

        if ('height' in this.size) {
            return this.size.height;
        }

        if ('width' in this.size) {
            return this.size.width * this.size.ratio;
        }

        if ('square' in this.size) {
            return this.size.square;
        }

        return null;
    }

    private getSizeString(scale: number = 1): string | null {
        if (!this.size) {
            return '';
        }

        if ('height' in this.size && 'width' in this.size) {
            return `${this.size.width * scale}x${this.size.height * scale}`;
        }

        if ('width' in this.size) {
            return `${this.size.width * scale}x`;
        }

        if ('height' in this.size) {
            return `x${this.size.height * scale}`;
        }

        if ('square' in this.size) {
            return `${this.size.square * scale}x${this.size.square * scale}`;
        }

        return '';
    }
}
