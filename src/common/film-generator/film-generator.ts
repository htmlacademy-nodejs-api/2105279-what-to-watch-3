import dayjs from 'dayjs';
import { MockData } from '../../types/mock-data.type.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../utils/random.js';
import { FilmGeneratorInterface } from './film-generator.interface.js';

const OLD_YEAR = 20;
const MAX_RATING = 10;
const RATING_DECIMAL = 1;
const MIN_RUN_TIME = 80;
const MAX_RUN_TIME = 150;
const MAX_AMOUNT_COMMENT = 30;
const MAX_USER_ID = 100;
const colors = ['red', 'blue', 'yellow', 'green', 'black', 'white'];

export default class OfferGenerator implements FilmGeneratorInterface {
  constructor(private readonly mockData: MockData) { }

  public generate(id: number): string {
    const name = getRandomItem<string>(this.mockData.names);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = new Date();
    const genre = getRandomItem(this.mockData.genres);
    const released = dayjs().subtract(generateRandomValue(0, OLD_YEAR), 'year').toString();
    const rating = generateRandomValue(0, MAX_RATING, RATING_DECIMAL);
    const previewVideoLink = getRandomItems(this.mockData.previewVideoLinks);
    const videoLink = getRandomItems(this.mockData.videoLinks);
    const actors = getRandomItems(this.mockData.actors);
    const producer = getRandomItem(this.mockData.producers);
    const runTime = generateRandomValue(MIN_RUN_TIME, MAX_RUN_TIME);
    const commentAmount = generateRandomValue(0, MAX_AMOUNT_COMMENT);
    const userId = generateRandomValue(0, MAX_USER_ID);
    const posterImage = getRandomItems(this.mockData.posterImages);
    const backgroundImage = getRandomItems(this.mockData.backgroundImages);
    const color = getRandomItem(colors);

    return [
      id,
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
      userId,
      posterImage,
      backgroundImage,
      color
    ].join('\t');
  }
}
