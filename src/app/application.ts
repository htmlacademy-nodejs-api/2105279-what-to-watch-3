import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import { Component } from '../types/component.types.js';
import { getURI } from '../utils/db.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';
//
import { UserServiceInterface } from '../modules/user/user-service.interface.js';
import { userContainer } from '../modules/user/user.container.js';
import { applicationContainer } from './application.container.js';
import { Container } from 'inversify';

@injectable()
export default class Application {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private databaseClient: DatabaseInterface
  ) { }

  public async init() {
    this.logger.info('Application initialization…');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(uri);

    //
    const user = {
      email: 'test@mail.ts',
      avatarPath: '123.jpg',
      name: 'one',
      password: '12345'
    };
    const mainContainer = Container.merge(
      applicationContainer,
      userContainer
    );

    const userService = mainContainer.get<UserServiceInterface>(Component.UserServiceInterface);
    userService.findOrCreate(user, this.config.get('SALT'));

  }
}
