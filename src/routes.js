import { Router } from 'express';

import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.use(authMiddleware);

routes.get('/notification/:name', NotificationController.index);

export default routes;
