export interface WsClient {
    a: {};
}

export interface WsServer {
    match: { matchedUserId: number };
}


export type WsClientFun = { [K in keyof WsClient]: (args: WsClient[K]) => void };
export type WsServerFun = { [K in keyof WsServer]: (args: WsServer[K]) => void };