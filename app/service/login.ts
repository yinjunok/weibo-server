import { Service } from 'egg';
import { Op } from 'sequelize';

export default class Login extends Service {
  public async login(nameOrEmail: string, password: string) {
    const { app, helper } = this.ctx;

    let result;
    try {
      result = await app.model.User.findOne({
        where: {
          [Op.or]: [
            { email: nameOrEmail },
            { nickname: nameOrEmail },
          ]},
      });
      if (result) {
        if (this.verifyPassword(password, result.dataValues.password)) {
          const data = helper.deleProp(result.dataValues, ['password']);
          return {
            error_code: 0,
            message: '登录成功',
            token: app.jwt.sign({
              email: result.email,
              nickname: result.nickname,
            },
            app.config.jwt.secret, {expiresIn: '30d'}),
            data,
          }
        } else {
          return {
            error_code: 1,
            message: '密码错误',
          }
        }
      } else {
        return {
          error_code: 1,
          message: '用户不存在',
        }
      }
    } catch (err) {
      console.log(err);
      throw new Error('未知错误');
    }
  }

  private verifyPassword (input: string, actual: string): boolean {
    const { addSalt } = this.ctx.helper;
    const { passwordSalt } = this.ctx.app.config;

    if (addSalt(input + passwordSalt) === actual) {
      return true;
    }
    return false;
  }
}
