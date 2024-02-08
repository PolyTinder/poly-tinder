import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageControlComponent } from './components/image-control/image-control.component';
import { CloudinaryModule } from '@cloudinary/ng';
import { UiModule } from '../ui/ui.module';

@NgModule({
    declarations: [ImageControlComponent],
    imports: [CommonModule, CloudinaryModule, UiModule],
    exports: [ImageControlComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ImageModule {}
