import { Message } from "./message";
import { UserValidationResponse } from "./user";

export interface WsClient {
    a: {};
}

export interface WsServer {
    'match:matched-active': { matchedUserId: number };
    'match:matched-passive': { matchedUserId: number };
    'message:new': Message;
    'match:update-list': {};
    'user-validation:update': UserValidationResponse,
}


export type WsClientFun = { [K in keyof WsClient]: (args: WsClient[K]) => void };
export type WsServerFun = { [K in keyof WsServer]: (args: WsServer[K]) => void };