import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { WsClient, WsServer } from 'common/models/ws';
import { BehaviorSubject, map, Observable, Subject, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WsService {
    private ws$: BehaviorSubject<Socket<WsServer, WsClient> | undefined> = new BehaviorSubject<Socket<WsServer, WsClient> | undefined>(undefined);

    constructor() {}

    connect(token: string): Subject<Socket<WsServer, WsClient>> {
        const subject = new Subject<Socket<WsServer, WsClient>>();

        const ws: Socket<WsServer, WsClient> = io(environment.api.url, {
            transports: ['websocket'],
            upgrade: false,
            auth: { token },
        });

        ws.on('connect', () => {
            subject.next(ws);
            subject.complete();
        });

        ws.on('disconnect', () => {
            this.ws$.next(undefined);
        });

        ws.on('connect_error', (error) => {
            subject.error(error);
        });

        this.ws$.next(ws);

        return subject;
    }

    disconnect() {
        this.ws$.value?.disconnect();
        this.ws$.next(undefined);
    }

    get ws() {
        return this.ws$.asObservable();
    }

    get connected() {
        return this.ws.pipe(map((ws) => !!ws));
    }

    listen<T extends keyof WsServer>(event: T): Observable<WsServer[T]> {
        return this.ws$.pipe(switchMap((ws) => {
            const subject = new Subject<WsServer[T]>();
            
            ws?.on(event as any, (data: WsServer[T]) => {
                subject.next(data);
            });

            return subject.asObservable();
        }))
    }

    next<T extends keyof WsClient>(event: T, data: WsClient[T]) {
        if (!this.ws$.value) throw new Error('WS not connected');
        this.ws$.value.emit(event as any, data);
    }
}
