import { Message } from "./message";

export interface WsClient {
    a: {};
}

export interface WsServer {
    'match:matched-active': { matchedUserId: number };
    'match:matched-passive': { matchedUserId: number };
    'message:new': Message;
    'match:update-list': {};
}


export type WsClientFun = { [K in keyof WsClient]: (args: WsClient[K]) => void };
export type WsServerFun = { [K in keyof WsServer]: (args: WsServer[K]) => void };