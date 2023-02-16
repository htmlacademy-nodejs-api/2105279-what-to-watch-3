import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Film } from '../types/film';
import { Review } from '../types/review';
import { NewReview } from '../types/new-review';
import { AuthData } from '../types/auth-data';
import { Token } from '../types/token';
import { NewFilm } from '../types/new-film';
import { APIRoute, DEFAULT_GENRE, NameSpace } from '../const';
import { User } from '../types/user';
import { NewUser } from '../types/new-user';
import { dropToken, saveToken } from '../services/token';
import { adaptsResponseToUser, adaptsFilmToRequest, adaptsResponseToFilm, adaptsResponseToReview, adaptsReviewToRequest } from './adapter';

type Extra = {
  api: AxiosInstance;
};

export const fetchFilms = createAsyncThunk<Film[], undefined, { extra: Extra }>(
  `${NameSpace.Films}/fetchFilms`,
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<Film[]>(APIRoute.Films);

    return data.map(adaptsResponseToFilm);
  }
);

export const fetchFilmsByGenre = createAsyncThunk<
  Film[],
  string,
  { extra: Extra }
>(`${NameSpace.Genre}/fetchFilmsByGenre`, async (genre, { extra }) => {
  const { api } = extra;
  let route = `${APIRoute.Genre}/${genre}`;
  if (genre === DEFAULT_GENRE) {
    route = APIRoute.Films;
  }
  const { data } = await api.get<Film[]>(route);

  return data.map(adaptsResponseToFilm);
});

export const fetchFilm = createAsyncThunk<Film, string, { extra: Extra }>(
  `${NameSpace.Film}/fetchFilm`,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<Film>(`${APIRoute.Films}/${id}`);

    return adaptsResponseToFilm(data);
  }
);

export const editFilm = createAsyncThunk<Film, Film, { extra: Extra }>(
  `${NameSpace.Film}/editFilm`,
  async (filmData, { extra }) => {
    const { api } = extra;
    const { data } = await api.patch<Film>(
      `${APIRoute.Films}/${filmData.id}`,
      adaptsFilmToRequest(filmData)
    );

    return adaptsResponseToFilm(data);
  }
);

export const addFilm = createAsyncThunk<Film, NewFilm, { extra: Extra }>(
  `${NameSpace.Film}/addFilm`,
  async (filmData, { extra }) => {
    const { api } = extra;
    const { data } = await api.post<Film>(APIRoute.Films, adaptsFilmToRequest(filmData));

    return adaptsResponseToFilm(data);
  }
);

export const deleteFilm = createAsyncThunk<Film, string, { extra: Extra }>(
  `${NameSpace.Film}/deleteFilm`,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.delete<Film>(`${APIRoute.Films}/${id}`);

    return adaptsResponseToFilm(data);
  }
);

export const fetchReviews = createAsyncThunk<
  Review[],
  string,
  { extra: Extra }
>(`${NameSpace.Reviews}/fetchReviews`, async (id, { extra }) => {
  const { api } = extra;
  const { data } = await api.get<Review[]>(`${APIRoute.Comments}/${id}`);

  return data.map(adaptsResponseToReview);
});

export const postReview = createAsyncThunk<
  Review,
  { id: Review['id']; review: NewReview },
  { extra: Extra }
>(`${NameSpace.Reviews}/postReview`, async ({ id, review }, { extra }) => {
  const { api } = extra;
  const { data } = await api.post<Review>(`${APIRoute.Comments}/${id}`, adaptsReviewToRequest(review));

  return adaptsResponseToReview(data);
});

export const checkAuth = createAsyncThunk<User, undefined, { extra: Extra }>(
  `${NameSpace.User}/checkAuth`,
  async (_arg, { extra }) => {
    const { api } = extra;
    try {
      const { data } = await api.get<User>(APIRoute.Login);
      return adaptsResponseToUser(data);
    } catch (error) {
      dropToken();
      return Promise.reject(error);
    }
  }
);

export const login = createAsyncThunk<User, AuthData, { extra: Extra }>(
  `${NameSpace.User}/login`,
  async (authData, { extra }) => {
    const { api } = extra;

    const { data } = await api.post<User & { token: Token }>(
      APIRoute.Login,
      authData
    );
    const { token } = data;
    saveToken(token);

    return adaptsResponseToUser(data);
  }
);

export const logout = createAsyncThunk<void, undefined, { extra: Extra }>(
  `${NameSpace.User}/logout`,
  async (_arg) => {
    dropToken();
  }
);

export const fetchFavoriteFilms = createAsyncThunk<
  Film[],
  undefined,
  { extra: Extra }
>(`${NameSpace.FavoriteFilms}/fetchFavoriteFilms`, async (_arg, { extra }) => {
  const { api } = extra;
  const { data } = await api.get<Film[]>(APIRoute.Favorite);

  return data.map(adaptsResponseToFilm);
});

export const fetchPromo = createAsyncThunk<Film, undefined, { extra: Extra }>(
  `${NameSpace.Promo}/fetchPromo`,
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<Film>(APIRoute.Promo);

    return adaptsResponseToFilm(data);
  }
);

export const setFavorite = createAsyncThunk<Film, Film['id'], { extra: Extra }>(
  `${NameSpace.FavoriteFilms}/setFavorite`,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.post<Film>(`${APIRoute.Favorite}/${id}/1`);

    return adaptsResponseToFilm(data);
  }
);

export const unsetFavorite = createAsyncThunk<
  Film,
  Film['id'],
  { extra: Extra }
>(`${NameSpace.FavoriteFilms}/unsetFavorite`, async (id, { extra }) => {
  const { api } = extra;
  const { data } = await api.post<Film>(`${APIRoute.Favorite}/${id}/0`);

  return adaptsResponseToFilm(data);
});

export const registerUser = createAsyncThunk<void, NewUser, { extra: Extra }>(
  `${NameSpace.User}/register`,
  async ({ email, password, name, avatar }, { extra }) => {
    const { api } = extra;
    await api.post<{ id: string }>(APIRoute.Register, {
      email,
      password,
      name,
    });

    const { data } = await api.post<User & { token: Token }>(
      APIRoute.Login,
      {
        email,
        password,
      }
    );
    const { token } = data;
    saveToken(token);

    if (avatar) {
      const payload = new FormData();
      payload.append('avatar', avatar);
      await api.post(`users${APIRoute.Avatar}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    dropToken();
  }
);
