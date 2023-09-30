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
        req: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        return next.handle(
            req.url.startsWith('http')
                ? req
                : req.clone({ url: `${environment.api.url}${req.url}` }),
        );
    }
}
