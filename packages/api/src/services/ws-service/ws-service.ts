import { singleton } from 'tsyringe';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { WsClientFun, WsServer, WsServerFun } from 'common/models/ws';
import { TwoWayMap } from '../../utils/two-way-map';
import { TypeOfId } from 'common/types/id';
import { User } from 'common/models/user';

@singleton()
export class WsService {
    private ws: Server<WsClientFun, WsServerFun> | undefined;
    private clients: TwoWayMap<TypeOfId<User>, string> = new TwoWayMap();
    private authenticationValidation:
        | ((token: string, socket: Socket) => Promise<void>)
        | undefined;

    /**
     * Initialize the websocket server
     *
     * @param server HTTP server to attach the websocket server to
     */
    instantiate(server: http.Server) {
        this.ws = new Server(server, {
            cors: { origin: '*', methods: ['GET', 'POST'] },
        });

        this.ws.on('connection', async (socket) => {
            const token: string | undefined = socket.handshake.auth.token;

            if (!token) {
                return socket.disconnect();
            }

            if (!this.authenticationValidation) {
                throw new Error('Authentication validation not registered');
            }

            try {
                await this.authenticationValidation(token, socket);
            } catch {
                return socket.disconnect();
            }
        });
    }

    /**
     * Register the validation function for authentication on socket connection
     *
     * @param validation Validation function
     */
    registerAuthenticationValidation(
        validation: (token: string, socket: Socket) => Promise<void>,
    ) {
        this.authenticationValidation = validation;
    }

    /**
     * Add an entry to the connected socket map
     *
     * @param userId ID of the connected client
     * @param socketId Socket ID of the connected client
     */
    connectClient(userId: number, socketId: string) {
        this.clients.set(userId, socketId);
    }

    /**
     * Remove an entry from the connected socket map
     *
     * @param socketId Socket ID of the disconnected client
     */
    disconnectSocket(socketId: string) {
        this.clients.removeRight(socketId);
    }

    get server() {
        if (!this.ws) {
            throw new Error('Websocket server not instantiated');
        }
        return this.ws;
    }

    /**
     * Emit an event to all sockets
     *
     * @param event Event name
     * @param data Event data
     */
    emit<T extends keyof WsServer>(event: T, data: WsServer[T]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.server.emit as any)(event, data);
    }

    /**
     * Emit an event to a user (will throw if user is not connected)
     *
     * @param userId ID of the user to emit to
     * @param event Event name
     * @param data Event data
     */
    emitToUser<T extends keyof WsServer>(
        userId: TypeOfId<User>,
        event: T,
        data: WsServer[T],
    ) {
        const socketId = this.clients.getLeft(userId);
        if (!socketId) {
            throw new Error('User not connected');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.server.to(socketId).emit as any)(event, data);
    }

    /**
     * Emit an event to a user (non breaking if user is not connected)
     *
     * @param userId ID of the user to emit to
     * @param event Event name
     * @param data Event data
     */
    emitToUserIfConnected<T extends keyof WsServer>(
        userId: TypeOfId<User>,
        event: T,
        data: WsServer[T],
    ) {
        const socketId = this.clients.getLeft(userId);
        if (!socketId) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.server.to(socketId).emit as any)(event, data);
    }
}
