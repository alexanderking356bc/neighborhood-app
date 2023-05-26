import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import jsonwebtoken, { JwtPayload, Secret } from 'jsonwebtoken';
import logger from './logger';
import config from './config';
import prismaClient from '../../prismaClient';
import { CustomRequest, RequestWithAuthentication } from '../types';
import catchError from './catchError';

/**
 * - Logs method, path and body of the http request
 * - if body has property `password`, logs `'*********' inplace of plain-text password`
 * @param request Request object from express
 * @param _response Response object from express
 * @param next NextFunction object from express
 */
const requestLogger = (request: Request, _response: Response, next: NextFunction): void => {
  const { method, path } = request;
  const bodyCopy = { ...request.body }; // Dont want to mutate `request.body`

  if (bodyCopy.password !== undefined) { bodyCopy.password = '********'; }
  logger.info(`${method} ${path} ${JSON.stringify(bodyCopy)}`);

  next();
};

const unknownEndpoint = (_request: Request, response: Response): void => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error: Error, _req: Request, response: Response, _next: NextFunction)
: void => {
  if (error.name === 'UserDataError') { // used
    response.status(400).send({ error: error.message });
  } else if (error.name === 'InvalidUserameOrPasswordError') { // used
    response.status(401).send({ error: error.message });
  } else if (error.name === 'NeighborhoodDataError') {
    response.status(400).send({ error: error.message });
  } else if (error.name === 'InvalidInputError') { // used
    response.status(400).send({ error: error.message });
  } else if (error.name === 'ResourceDoesNotExistError') {
    response.status(404).send({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    response.status(400).send({ error: error.message });
  } else if (error instanceof SyntaxError) {
    response.status(400).send({ error: error.message });
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      response.status(404).send({ error: error.message });
    } else {
      response.status(400).send({ error: error.message });
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    response.status(400).send({ error: error.message });
  } else {
    logger.error(error.message);
    response.status(500).send({ error: 'Oops! An error happened' });
  }
};

/**
 * Extracts the authorization header from an incoming request
 * The authorization header is a string composed of the authorization schema (In our case 'Bearer')
and the token that was saved by the client on user login
 * The middleware checks if the correct authorization schema is used and saves the token to a
'token' property on the request object.
 */
const tokenExtractor = (req: CustomRequest, _res: Response, next: NextFunction): void => {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '');
  }
  next();
};

/**
 * IF Authorization token was sent with a request, the function extracts the user associated
 * with the token and assigns it to a user property on the request object.
 */
const getUserFromRequest = catchError(async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.token) {
    const decodedToken = jsonwebtoken.verify(req.token, config.SECRET as Secret) as JwtPayload;
    if (!decodedToken.id) {
      res.status(401).json({ error: 'Invalid token' });
    }

    req.user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: decodedToken.id,
      },
    });
  }

  next();
});

/**
Creates a user property on the request object with the user extracted with the
aid of the authentication token.
 */
const userExtractor = catchError(async (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.token) {
    res.status(401).json({ error: 'Invalid User Credentials' });
  } else {
    getUserFromRequest(req, res, next);
  }
});

/**
 * if request has valid token, extracts userId and adds it to the request
 * else if , request has invalid token ends the request with 401
 * else if request has no token, does nothing
 */
const userIdExtractor = catchError(async (
  req: RequestWithAuthentication,
  res: Response,
  next: NextFunction,
) => {
  const { token } = req;

  if (token) {
    const secret: string = config.SECRET as string;
    const decodedToken = jsonwebtoken.verify(token, secret) as JwtPayload;
    if (!decodedToken.id) {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      req.loggedUserId = decodedToken.id;
    }
  }

  next();
});

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  getUserFromRequest,
  userIdExtractor,
};
