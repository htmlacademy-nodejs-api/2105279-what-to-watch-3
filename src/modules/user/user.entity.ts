import { User } from '../../types/user.type.js';
import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';
import { createSHA256 } from '../../utils/common.js';
import { DEFAULT_AVATAR_FILE_NAME, UserOption } from './user.constant.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.email = data.email;
    this.avatarPath = data.avatarPath;
    this.name = data.name;
  }

  @prop({
    unique: true,
    required: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect']
  })
  public email!: string;

  @prop({
    default: DEFAULT_AVATAR_FILE_NAME
  })
  public avatarPath!: string;

  @prop({
    required: true,
    minlength: [UserOption.MinLengthName, `Min length for name is ${UserOption.MinLengthName}`],
    maxlength: [UserOption.MaxLengthName, `Max length for name is ${UserOption.MaxLengthName}`]
  })
  public name!: string;

  @prop({ required: true })
  private password!: string;

  public setPassword(password: string, salt: string) {
    if (password.length < UserOption.MinLengthPassword || password.length > UserOption.MaxLengthPassword) {
      throw new Error('Password incorrect symbols length');
    }

    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
