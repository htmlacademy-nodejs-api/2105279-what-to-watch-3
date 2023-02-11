import { Controller } from '../../common/controller/controller.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Request, Response } from 'express';
import CreateFilmDto from './dto/create-film.dto.js';
import { FilmServiceInterface } from './film-service.interface.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/common.js';
import FilmResponse from './response/film.response.js';
import { UserServiceInterface } from '../user/user-service.interface.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { Genre } from '../../types/genre.type.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import UserResponse from '../user/response/user.response.js';
import { FavoriteServiceInterface } from '../favorite/favorite-service.interface.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import FilmDetailResponse from './response/film-detail.response.js';
import { DocumentType } from '@typegoose/typegoose';
import { FilmEntity } from './film.entity.js';

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for FilmController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateFilmDto)
      ]
    });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/promo', method: HttpMethod.Get, handler: this.promo });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(UpdateFilmDto),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'id')
      ]
    });
    this.addRoute({
      path: '/genre/:genre',
      method: HttpMethod.Get,
      handler: this.findByGenre
    });
  }

  public async create(
    { body, user }: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response,
  ): Promise<void> {
    const result = await this.filmService.create({ ...body, user: user.id });
    this.send(
      res,
      StatusCodes.CREATED,
      {
        ...fillDTO(FilmDetailResponse, result),
        user: fillDTO(
          UserResponse,
          await this.userService.findById(user.id)
        )
      }
    );
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { body, user } = req;
    const film = await this.filmService.show(req.params.id);

    if (film?.user?.toString() === user.id) {
      const result = await this.filmService.update(req.params.id, body);
      const response = await this.addFavoriteField(result, user.id);
      this.send(
        res,
        StatusCodes.CREATED,
        fillDTO(FilmDetailResponse, response)
      );
    }

    throw new HttpError(
      StatusCodes.CONFLICT,
      'Update must only author',
      'UserController'
    );
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const filmId = req.params.id;
    const { user } = req;
    const film = await this.filmService.show(filmId);

    if (film?.user?.toString() === user.id) {
      await this.commentService.delete(filmId);
      await this.favoriteService.deleteAll(filmId);
      const result = await this.filmService.delete(filmId);
      this.send(
        res,
        StatusCodes.OK,
        fillDTO(FilmResponse, result)
      );
    }

    throw new HttpError(
      StatusCodes.CONFLICT,
      'Delete must only author',
      'UserController'
    );

  }

  public async index({ user }: Request, res: Response): Promise<void> {
    const result = await this.filmService.index();
    if (user) {
      for (const key in result) {
        result[key].isFavorite = await this.favoriteService.exists({ film: result[key].id, user: user.id });
      }
    }

    const response = result.map((value) => fillDTO(FilmResponse, value));
    this.send(
      res,
      StatusCodes.OK,
      response
    );
  }

  public async show(req: Request, res: Response): Promise<void> {
    const result = await this.filmService.show(req.params.id);
    const response = await this.addFavoriteField(result, req.user.id);
    this.send(
      res,
      StatusCodes.OK,
      fillDTO(FilmDetailResponse, response)
    );
  }

  public async promo(req: Request, res: Response): Promise<void> {
    const result = await this.filmService.promo();
    const response = await this.addFavoriteField(result, req.user.id);
    this.send(
      res,
      StatusCodes.OK,
      fillDTO(FilmDetailResponse, response)
    );
  }

  public async findByGenre(req: Request, res: Response): Promise<void> {
    const { genre } = req.params;

    if (!Object.values(Genre).some((value) => value === genre)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Genre with ${genre} not implements, use only: ${Object.values(Genre).join(', ')}`,
        'UserController'
      );
    }

    const result = await this.filmService.findByGenre(genre);

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with genre ${genre} not exists.`,
        'UserController'
      );
    }

    if (req.user) {
      for (const key in result) {
        result[key].isFavorite = await this.favoriteService.exists({ film: result[key].id, user: req.user.id });
      }
    }
    this.send(
      res,
      StatusCodes.OK,
      fillDTO(FilmResponse, result)
    );
  }

  private async addFavoriteField<T extends DocumentType<FilmEntity> | null>(film: T, user: string): Promise<T> {
    return ({
      ...film,
      isFavorite: await this.favoriteService.exists({ film: film?._id.toString(), user })
    });
  }
}
