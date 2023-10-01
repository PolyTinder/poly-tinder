import { Message } from "./message";

export interface WsClient {
    a: {};
}

export interface WsServer {
    match: { matchedUserId: number };
    'message:new': Message;
}


export type WsClientFun = { [K in keyof WsClient]: (args: WsClient[K]) => void };
export type WsServerFun = { [K in keyof WsServer]: (args: WsServer[K]) => void };