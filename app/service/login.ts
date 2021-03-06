import { Service } from 'egg';
import { Op } from 'sequelize';

export default class Login extends Service {
  public async login(username: string, password: string) {
    const { app, helper } = this.ctx;

    let result;
    try {
      result = await app.model.User.findOne({
        where: {
          [Op.or]: [
            { email: username },
            { nickname: username },
          ]},
      });

      if (result) {
        if (this.verifyPassword(password, result.dataValues.password)) {
          const data = helper.deleProp(result.dataValues, ['password']);
          const token = app.jwt.sign(
            { ...data },
            app.config.jwt.secret, {expiresIn: '30d'},
          );

          return {
            error_code: 0,
            message: '登录成功',
            data: {
              ...data,
              token,
            },
          };
        } else {
          return {
            error_code: 1,
            message: '密码错误',
          };
        }
      } else {
        return {
          error_code: 1,
          message: '用户不存在',
        };
      }
    } catch (err) {
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
