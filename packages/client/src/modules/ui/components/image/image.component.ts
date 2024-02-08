import { Component, Input } from '@angular/core';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';

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
    @Input() publicID: string | undefined | null = null;
    @Input() alt!: string;
    @Input() size: ImageSize | null = null;
    @Input() inferSize: boolean = false;

    getSrc(scale: number = 1): string | null {
        let image = this.getImage();

        if (!image) return null;

        image = this.resizeImage(image, scale);

        return image.toURL();
    }

    getSrcset(): string | null {
        return `${this.getSrc(0.5)} 0.5x, ${this.getSrc(1)} 1x, ${this.getSrc(
            2,
        )} 2x`;
    }

    private resizeImage(
        image: CloudinaryImage,
        scale: number = 1,
    ): CloudinaryImage {
        let resize = thumbnail();

        if (this.height) resize = resize.height(this.height * scale);
        if (this.width) resize = resize.width(this.width * scale);

        return image.resize(resize);
    }

    private getImage(): CloudinaryImage | null {
        if (!this.publicID) return null;

        return new Cloudinary({ cloud: { cloudName: 'dofjtcdow' } }).image(
            this.publicID,
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
            return Math.floor(this.size.height * this.size.ratio);
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
            return Math.floor(this.size.width * this.size.ratio);
        }

        if ('square' in this.size) {
            return this.size.square;
        }

        return null;
    }
}
