import { DocumentType } from '@typegoose/typegoose';
import { Genre } from '../../types/genre.type.js';
import CreateFilmDto from './dto/create-film.dto.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { FilmEntity } from './film.entity.js';

export interface FilmServiceInterface {

  /** Добавление новой карточки с фильмом*/
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;

  /** Редактирование карточки фильма*/
  updateById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null>;

  /** Удаление карточки фильма*/
  deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null>;

  /** Получение списка фильмов*/
  find(): Promise<DocumentType<FilmEntity>[]>;

  /** Получение списка фильмов определённого жанра*/
  findByGenre(genre: Genre, count?: number): Promise<DocumentType<FilmEntity>[]>;

  /** Получение детальной информации по фильму*/
  findById(filmId: string): Promise<DocumentType<FilmEntity> | null>;

  /** Получение промо - фильма*/
  findPromo(): Promise<DocumentType<FilmEntity> | null>;

  /** Увеличение счётчика комментариев*/
  incCommentCount(FilmId: string): Promise<DocumentType<FilmEntity> | null>;
}
