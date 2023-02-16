import { Expose, Type } from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';

export default class FilmDetailResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public description!: string;

  @Expose({ name: 'createdAt' })
  public publicationDate!: string;

  @Expose()
  public genre!: string;

  @Expose()
  public released!: string;

  @Expose()
  public rating!: number;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public videoLink!: string;

  @Expose()
  public actors!: string[];

  @Expose()
  public producer!: string;

  @Expose()
  public runTime!: number;

  @Expose()
  public commentAmount!: number;

  @Expose()
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public posterImage!: string;

  @Expose()
  public backgroundImage!: string;

  @Expose()
  public color!: string;

  @Expose()
  public isFavorite!: boolean;
}
