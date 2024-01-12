import express, { Response } from 'express';
// import { Novu } from '@novu/node';
import catchError from '../utils/catchError';
import middleware from '../utils/middleware';
import { RequestWithAuthentication } from '../types';
import { triggers } from '../services/notificationServices';
import neighborhoodServices from '../services/neighborhoodServices';

// MOVE KEY TO .env file
// const NOVU_API_KEY = '9cc0a07918a5743da4558428c33d6558';
// const novu = new Novu(NOVU_API_KEY);

const notificationsRouter = express.Router();

// Create request
notificationsRouter.post(
  '/join-neighborhood/:neighborhoodId',
  middleware.userIdExtractorAndLoginValidator,
  middleware.validateURLParams,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const loggedUserId: number = req.loggedUserId as number;
    const { neighborhoodId } = req.params;

    const neighborhood = await neighborhoodServices.getNeighborhoodDetailsForMembers(+neighborhoodId);
    const adminId = String(neighborhood.admin_id);

    triggers.joinNeighborhood(adminId, String(loggedUserId), neighborhoodId);
    return res.status(200);
  }),
);

export default notificationsRouter;