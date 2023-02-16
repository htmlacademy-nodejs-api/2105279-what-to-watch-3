import { Controller } from '../../common/controller/controller.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../utils/common.js';
import { FavoriteServiceInterface } from './favorite-service.interface.js';
import { FilmServiceInterface } from '../film/film-service.interface.js';
import FilmResponse from '../film/response/film.response.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { ConfigInterface } from '../../common/config/config.interface.js';

@injectable()
export default class FavoriteController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface
  ) {
    super(logger, configService);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/:id/1',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'id')
      ]
    });
    this.addRoute({
      path: '/:id/0',
      method: HttpMethod.Post,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'id')
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new PrivateRouteMiddleware()]
    });
  }

  public async create(req: Request, res: Response,): Promise<void> {
    await this.favoriteService.create({ film: req.params.id, user: req.user.id });
    const result = await this.filmService.show(req.params.id);
    this.ok(res, { ...fillDTO(FilmResponse, result), isFavorite: true });
  }

  public async delete(req: Request, res: Response): Promise<void> {
    await this.favoriteService.delete({ film: req.params.id, user: req.user.id });
    const result = await this.filmService.show(req.params.id);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  public async index(req: Request, res: Response): Promise<void> {
    const result = await this.favoriteService.index(req.user.id);
    this.ok(res, result.map((value) => ({ ...fillDTO(FilmResponse, value.film), isFavorite: true })));
  }
}
