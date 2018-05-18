import { Service } from 'egg';
import { Op } from 'sequelize';

export default class Login extends Service {
  public async login(nameEmail: string, password: string) {
    const { app } = this.ctx;
    console.log(password);
    let result;
    try {
      result = await app.model.User.findOne({
        where: {
          [Op.or]: [
            { email: nameEmail },
            { nickname: nameEmail }
          ]},
      });
      console.log(result);
    } catch (err) {
      console.log(err);
    }
    console.log(this);
    // return app.jwt.sign({email: result.email, nickname: result.nickname}, app.config.jwt.secret, '30d');
  }
}
