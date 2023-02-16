import typegoose, { getModelForClass, defaultClasses, Ref } from '@typegoose/typegoose';
import { Genre } from '../../types/genre.type.js';
import { UserEntity } from '../user/user.entity.js';
import { FilmOption } from './film.constant.js';

const { prop, modelOptions } = typegoose;

export interface FilmEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'films'
  }
})
export class FilmEntity extends defaultClasses.TimeStamps {
  @prop({
    trim: true,
    required: true,
    default: '',
    minlength: [FilmOption.MinLengthName, `Min length for name is ${FilmOption.MinLengthName}`],
    maxlength: [FilmOption.MaxLengthName, `Max length for name is ${FilmOption.MaxLengthName}`]
  })
  public name!: string;

  @prop({
    trim: true,
    required: true,
    default: '',
    minlength: [FilmOption.MinLengthDescription, `Min length for description is ${FilmOption.MinLengthDescription}`],
    maxlength: [FilmOption.MaxLengthDescription, `Max length for description is ${FilmOption.MaxLengthDescription}`]
  })
  public description!: string;

  @prop({
    required: true
  })
  public genre!: Genre;

  @prop({
    required: true
  })
  public released!: string;

  @prop({
    required: true,
    default: 0
  })
  public rating!: number;

  @prop({
    required: true,
    default: ''
  })
  public previewVideoLink!: string;

  @prop({
    required: true,
    default: ''
  })
  public videoLink!: string;

  @prop({
    required: true,
    default: []
  })
  public actors!: string[];

  @prop({
    required: true,
    default: '',
    minlength: [FilmOption.MinLengthProducerName, `Min length for producer is ${FilmOption.MinLengthProducerName}`],
    maxlength: [FilmOption.MaxLengthProducerName, `Max length for producer is ${FilmOption.MaxLengthProducerName}`]
  })
  public producer!: string;

  @prop({
    required: true
  })
  public runTime!: number;

  @prop({
    required: true,
    default: 0
  })
  public commentAmount!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public user!: Ref<UserEntity>;

  @prop({
    required: true,
    default: ' '
  })
  public posterImage!: string;

  @prop({
    required: true,
    default: ' '
  })
  public backgroundImage!: string;

  @prop({
    required: true,
    default: FilmOption.DefaultColor
  })
  public color!: string;

  @prop({
    default: false
  })
  public isPromo!: boolean;

  @prop({
    default: false
  })
  public isFavorite!: boolean;
}

export const FilmModel = getModelForClass(FilmEntity);
