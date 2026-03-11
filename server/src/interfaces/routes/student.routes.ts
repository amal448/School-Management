import { Router } from 'express';
import { makeExpressCallback } from '../adapters/express-adapter'

export const StudentRoutes = (controller: any) => {
  const router = Router();
  // Wrap the controller method!
  router.post('/', makeExpressCallback(controller.createStudent));
  return router;
};