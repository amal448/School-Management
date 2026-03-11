import { Request, Response } from 'express';

export const makeExpressCallback = (controllerMethod: any) => {
  return async (req: Request, res: Response) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      user: (req as any).user,
    };

    try {
      const httpResponse = await controllerMethod(httpRequest);
      if (httpResponse.headers) {
        res.set(httpResponse.headers);
      }
      res.type('json');
      res.status(httpResponse.statusCode).send(httpResponse.body);
    } catch (e: any) {
      res.status(500).send({ error: 'An unknown error occurred.' });
    }
  };
};