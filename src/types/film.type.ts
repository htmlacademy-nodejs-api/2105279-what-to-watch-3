import { Genre } from './genre.type.js';
import { User } from './user.type.js';

export type Film = {
  name: string;
  description: string;
  publicationDate: string;
  genre: Genre;
  released: string;
  rating: number;
  previewVideoLink: string;
  videoLink: string;
  actors: string[];
  producer: string;
  runTime: number;
  commentAmount: number;
  user: User;
  posterImage: string;
  backgroundImage: string;
  color: string;
};
