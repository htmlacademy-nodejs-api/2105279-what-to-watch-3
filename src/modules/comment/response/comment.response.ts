import { Expose, Type } from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';

export default class CommentResponse {
  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose()
  public released!: string;

  @Expose()
  @Type(() => UserResponse)
  public author!: string;
}
