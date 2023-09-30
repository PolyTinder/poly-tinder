import {
    HttpEvent,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionService } from 'src/modules/authentication/services/session-service/session.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
    intercept(
        req: HttpRequest<unknown>,
        next: HttpHandler,
    ): Observable<HttpEvent<unknown>> {
        const token = inject(SessionService).getLocalToken();

        return next.handle(
            token
                ? req.clone({
                      headers: new HttpHeaders({
                          authorization: `Bearer ${token}`,
                      }),
                  })
                : req,
        );
    }
}
