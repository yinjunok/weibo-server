import { Service } from 'egg';

export default class Registered extends Service {
  public async create(email: string, password: string, nickname: string) {
    return {
      email,
      password,
      nickname,
    };
  }
}