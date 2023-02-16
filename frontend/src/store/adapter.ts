/* eslint-disable @typescript-eslint/no-explicit-any */
import { Film } from '../types/film.js';
import { Review } from '../types/review.js';
import { User } from '../types/user.js';

export const adaptsResponseToUser = (data: any): User => {
  const result = {
    ...data,
    avatarUrl: data.avatarPath
  };
  delete result['avatarPath'];

  return result;
};

export const adaptsFilmToRequest = (data: any) => {
  const result = {
    ...data,
    actors: data.starring,
    color: data.backgroundColor,
    producer: data.director
  };
  delete result['starring'];
  delete result['backgroundColor'];

  return result;
};

export const adaptsResponseToFilm = (data: any): Film => {
  const result = {
    ...data,
    starring: data.actors,
    backgroundColor: data.color,
    director: data.producer
  };
  delete result['actors'];
  delete result['color'];
  delete result['producer'];

  return result;
};

export const adaptsReviewToRequest = (data: any) => {
  const result = {
    ...data,
    text: data.comment
  };
  delete result['comment'];

  return result;
};

export const adaptsResponseToReview = (data: any): Review => ({
  comment: data.text,
  date: data.released,
  id: data.id,
  rating: data.rating,
  user: {
    name: data.author.name
  }
});
