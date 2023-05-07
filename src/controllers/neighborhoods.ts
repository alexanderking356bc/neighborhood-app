import express, { Request, Response } from 'express';
import { Neighborhood } from '@prisma/client';
import catchError from '../utils/catchError';
import prismaClient from '../../prismaClient';
import middleware from '../utils/middleware';
import routeHelpers from '../utils/routeHelpers';
import { CustomRequest } from '../types';

const neighborhoodsRouter = express.Router();

neighborhoodsRouter.get('/', catchError(async (_req: Request, res: Response) => {
  const neighborhoods = await prismaClient.neighborhood.findMany({});
  if (neighborhoods.length === 0) {
    res.status(404).end();
  } else {
    res.send(neighborhoods);
  }
}));

neighborhoodsRouter.delete('/:id', middleware.userExtractor, catchError(async (req: CustomRequest, res: Response) => {
  if (req.user && await routeHelpers.isAdmin(req.user.id, Number(req.params.id))) {
    const deletedNeighborhood = await prismaClient.neighborhood.delete({
      where: { id: +req.params.id },
    });
    res.status(200).send(`Neighborhood '${deletedNeighborhood.name}' has been deleted.`);
  } else {
    res.status(403).send({ error: 'User is not the admin of this neighborhood' });
  }
}));

neighborhoodsRouter.put('/:id', catchError(async (req, res) => {
  const data = req.body;
  const updatedNeighborhood = await prismaClient.neighborhood.update({
    where: { id: +req.params.id },
    data,
  });

  res.status(200).send(`Neighborhood '${updatedNeighborhood.name}' has been updated.`);
}));

neighborhoodsRouter.post('/', middleware.userExtractor, catchError(async (req: CustomRequest, res: Response) => {
  req.body.admin_id = req.user?.id; // adding user_id as admin_id  pto request.body
  const createNeighborhoodData = await routeHelpers.generateCreateNeighborhoodData(req.body);

  const newNeighborhood: Neighborhood = await prismaClient.neighborhood
    .create({ data: createNeighborhoodData });

  await prismaClient.neighborhood.update({
    where: { id: newNeighborhood.id },
    data: {
      users: {
        connect: { id: req.body.admin_id },
      },
    },
  });

  // console.log(newNeighborhood.users);

  res.status(201).json(newNeighborhood);
}));

neighborhoodsRouter.post('/:id/join', catchError(async (_req: CustomRequest, res: Response) => {
  res.status(200).send('user will join the neighborhood');
}));

export default neighborhoodsRouter;
