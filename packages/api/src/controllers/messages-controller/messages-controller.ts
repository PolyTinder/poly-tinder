import { Response, Router } from 'express';
import { AbstractController } from '../abstract-controller';
import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import { MessagesService } from '../../services/messages-service/messages-service';
import { auth } from '../../middlewares/auth';
import { UserRequest } from '../../types/requests';
import { Message } from 'common/models/message';

@singleton()
export class MessagesController extends AbstractController {
    constructor(private readonly messagesService: MessagesService) {
        super('/messages');
    }

    protected configureRouter(router: Router): void {
        router.get(
            '/:recipiendId',
            auth,
            async (
                req: UserRequest<{ recipiendId: string }>,
                res: Response,
                next,
            ) => {
                try {
                    res.status(StatusCodes.OK).json(
                        await this.messagesService.getMessages(
                            req.body.session.user.userId,
                            parseInt(req.params.recipiendId, 10),
                            20,
                            0,
                        ),
                    );
                } catch (e) {
                    next(e);
                }
            },
        );

        router.post(
            '/',
            auth,
            async (
                req: UserRequest<
                    object,
                    Pick<Message, 'recipientId' | 'content'>
                >,
                res: Response,
                next,
            ) => {
                try {
                    await this.messagesService.sendMessage(
                        req.body.session.user.userId,
                        req.body.recipientId,
                        req.body.content,
                    );
                    res.status(StatusCodes.NO_CONTENT).send();
                } catch (e) {
                    next(e);
                }
            },
        );
    }
}
