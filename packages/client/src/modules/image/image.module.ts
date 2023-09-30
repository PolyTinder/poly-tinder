import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageControlComponent } from './components/image-control/image-control.component';
import { UcWidgetModule } from 'ngx-uploadcare-widget';



@NgModule({
  declarations: [
    ImageControlComponent,
  ],
  imports: [
    CommonModule,
    UcWidgetModule,
  ],
  exports: [
    ImageControlComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ImageModule { }
