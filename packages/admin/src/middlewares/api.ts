import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    intercept(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req: HttpRequest<any>,
        next: HttpHandler,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Observable<HttpEvent<any>> {
        return next.handle(
            req.url.startsWith('http')
                ? req
                : req.clone({ url: `${environment.api.url}${req.url}` }),
        );
    }
}
