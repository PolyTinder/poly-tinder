import { Request } from 'express';
import { UserPublicSession } from 'common/models/authentication';

export type UserRequest<Params = object, Body = object> = Request<
    Params,
    object,
    Body & { session: UserPublicSession }
>;
