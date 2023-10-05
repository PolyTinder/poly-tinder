import {
    HttpEvent,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
    intercept(
        req: HttpRequest<unknown>,
        next: HttpHandler,
    ): Observable<HttpEvent<unknown>> {
        const token = inject(UserService).getSavedToken();

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
