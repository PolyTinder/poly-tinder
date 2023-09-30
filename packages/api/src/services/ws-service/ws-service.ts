import { singleton } from 'tsyringe';
import http from 'http';
import { Server } from 'socket.io';
import { WsClient, WsServer } from 'common/models/ws';
import { TwoWayMap } from '../../utils/two-way-map';
import { TypeOfId } from 'common/types/id';
import { User } from 'common/models/user';
import { AuthenticationService } from '../authentication-service/authentication-service';

@singleton()
export class WsService {
    private ws: Server<WsClient, WsServer> | undefined;
    private clients: TwoWayMap<TypeOfId<User>, string> = new TwoWayMap();

    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}

    instantiate(server: http.Server) {
        this.ws = new Server(server, {
            cors: { origin: '*', methods: ['GET', 'POST'] },
        });

        this.ws.on('connection', (socket) => {
            const token: string | undefined = socket.handshake.auth.token;

            if (!token) {
                return socket.disconnect();
            }

            this.authenticationService.loadSession(token).then((session) => {
                if (!session) {
                    return socket.disconnect();
                }

                this.clients.set(session.user.userId, socket.id);

                socket.on('disconnect', () => {
                    this.clients.removeRight(socket.id);
                });
            });
        });
    }

    get server() {
        if (!this.ws) {
            throw new Error('Websocket server not instantiated');
        }
        return this.ws;
    }

    emit<T extends keyof WsServer>(event: T, ...data: Parameters<WsServer[T]>) {
        this.server.emit(event, ...data);
    }

    emitToUser<T extends keyof WsServer>(
        userId: TypeOfId<User>,
        event: T,
        ...data: Parameters<WsServer[T]>
    ) {
        const socketId = this.clients.getLeft(userId);
        if (!socketId) throw new Error('User not connected');
        this.server.to(socketId).emit(event, ...data);
    }
}
