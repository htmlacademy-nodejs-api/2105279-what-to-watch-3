import * as jose from 'jose';
import crypto from 'crypto';
import { Film } from '../types/film.type.js';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces/class-constructor.type.js';

export const createFilm = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    name,
    description,
    publicationDate,
    genre,
    released,
    rating,
    previewVideoLink,
    videoLink,
    actors,
    producer,
    runTime,
    commentAmount,
    posterImage,
    backgroundImage,
    color,
    user,
    email,
    avatarPath
  ] = tokens;

  return {
    name,
    description,
    publicationDate,
    genre,
    released,
    rating: Number(rating),
    previewVideoLink,
    videoLink,
    actors: actors.split(','),
    producer,
    runTime: Number(runTime),
    commentAmount: Number(commentAmount),
    posterImage,
    backgroundImage,
    color,
    user: {
      name: user,
      email,
      avatarPath
    }
  } as Film;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });

export const createErrorObject = (message: string) => ({
  error: message,
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: algoritm })
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
