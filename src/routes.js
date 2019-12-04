import { Router } from 'express';

import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => res.json({ ok: true }));

routes.use(authMiddleware);

routes.get('/notification/:aquariumName', NotificationController.list);
routes.put('/notification/:id', NotificationController.update);

export default routes;
