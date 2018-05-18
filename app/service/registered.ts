import { Service } from 'egg';

interface FindResult {
  emailExist: boolean;
  nicknameExist: boolean;
}

export default class Registered extends Service {
  // 查询昵称, 邮箱是否已经注册
  public async isExist(email: string, nickname: string): Promise<FindResult> {
    const { app } = this.ctx;
    let result: [any, any];

    try {
      result = await Promise.all([
          app.model.User.findOne({ where: { email } }),
          app.model.User.findOne({ where: { nickname } }),
      ]);
    } catch (err) {
      return err;
    }

    return {
      emailExist: !!result[0],
      nicknameExist: !!result[1],
    };
  }

  public async registered(email: string, nickname: string, password: string) {
    const { app, helper } = this.ctx;
    try {
      await app.model.User.create({
        email,
        nickname,
        password: helper.addSalt(password + app.config.passwordSalt),
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
