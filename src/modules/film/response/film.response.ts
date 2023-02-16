import { Expose, Type } from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';

export default class FilmResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose({ name: 'createdAt' })
  public publicationDate!: string;

  @Expose()
  public genre!: string;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public commentAmount!: number;

  @Expose()
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public posterImage!: string;

  @Expose()
  public isFavorite!: boolean;
}
