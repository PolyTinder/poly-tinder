import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as LR from '@uploadcare/blocks';

import { AppModule } from './app.module';

LR.registerBlocks(LR);

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    // eslint-disable-next-line no-console
    .catch((err) => console.error(err));
