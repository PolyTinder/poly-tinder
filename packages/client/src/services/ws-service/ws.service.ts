import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { WsClient, WsServer } from 'common/models/ws';
import { BehaviorSubject, map, Observable, Subject, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WsService {
    private ws$: BehaviorSubject<Socket<WsServer, WsClient> | undefined> =
        new BehaviorSubject<Socket<WsServer, WsClient> | undefined>(undefined);
    readonly disconnect$ = new Subject<void>();

    constructor() {}

    connect(token: string): Observable<Socket<WsServer, WsClient> | undefined> {
        try {
            const ws: Socket<WsServer, WsClient> = io(environment.api.url, {
                transports: ['websocket'],
                upgrade: false,
                auth: { token },
            });

            ws.on('connect', () => {
                this.ws$.next(ws);
            });

            ws.on('disconnect', () => {
                this.ws$.next(undefined);
                this.disconnect$.next();
            });

            ws.on('connect_error', (error) => {
                // eslint-disable-next-line no-console
                console.error('WebSocket error', error);
            });
        } catch (e) {
            this.ws$.error(e);
        }

        return this.ws$.asObservable();
    }

    disconnect() {
        this.ws$.value?.disconnect();
        this.ws$.next(undefined);
        this.disconnect$.next();
    }

    get ws() {
        return this.ws$.asObservable();
    }

    get connected() {
        return this.ws.pipe(map((ws) => !!ws));
    }

    listen<T extends keyof WsServer>(event: T): Observable<WsServer[T]> {
        return this.ws$.pipe(
            switchMap((ws) => {
                const subject = new Subject<WsServer[T]>();

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ws?.on(event as any, (data: WsServer[T]) => {
                    subject.next(data);
                });

                return subject.asObservable();
            }),
        );
    }

    next<T extends keyof WsClient>(event: T, data: WsClient[T]) {
        if (!this.ws$.value) throw new Error('WS not connected');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.ws$.value.emit(event as any, data);
    }
}
