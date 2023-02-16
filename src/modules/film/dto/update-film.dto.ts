
import { Genre } from '../../../types/genre.type.js';
import { IsArray, IsEnum, IsHexColor, IsInt, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { FilmOption } from '../film.constant.js';

export default class UpdateFilmDto {
  @MinLength(FilmOption.MinLengthName, { message: `Min length for name is ${FilmOption.MinLengthName}` })
  @MaxLength(FilmOption.MaxLengthName, { message: `Max length for name is ${FilmOption.MaxLengthName}` })
  public name?: string;

  @MinLength(FilmOption.MinLengthDescription, { message: `Minimum description length must be ${FilmOption.MinLengthDescription}` })
  @MaxLength(FilmOption.MaxLengthDescription, { message: `Maximum description length must be ${FilmOption.MaxLengthDescription}` })
  public description?: string;

  @IsEnum(Genre, { message: `type must be ${Object.values(Genre).join(', ')}` })
  public genre?: Genre;

  @IsInt({ message: 'Released must be integer' })
  public released?: number;

  @IsUrl({}, { message: 'Link must be URL' })
  public previewVideoLink?: string;

  @IsUrl({}, { message: 'Link must be URL' })
  public videoLink?: string;

  @IsArray({ message: 'Field actors must be an array' })
  @IsString({ each: true, message: 'Field actors must be string' })
  public actors?: string[];

  @MinLength(FilmOption.MinLengthProducerName, { message: `Min length for producer is ${FilmOption.MinLengthProducerName}` })
  @MaxLength(FilmOption.MaxLengthProducerName, { message: `Max length for producer is ${FilmOption.MaxLengthProducerName}` })
  public producer?: string;

  @IsInt({ message: 'Runtime must be integer' })
  public runTime?: number;

  public posterImage?: string;

  public backgroundImage?: string;

  @IsHexColor({ message: 'Color must be hex format' })
  public color?: string;
}
