import { Controller } from 'egg';
// import { isEmail } from 'validator';

export default class Login extends Controller {
  public async login() {
    const { ctx } = this;
    const {
      email_or_name,
      password,
    } = ctx.request.body;

    // if (!isEmail(email_name)) {
    //   ctx.body = {
    //     error_code: 1,
    //     message: '邮箱格式错误',
    //   };
    //   return;
    // }

    // if (password.length < 6) {
    //   ctx.body = {
    //     error_code: 1,
    //     message: '密码长度不能小于6位',
    //   };
    //   return;
    // }
    
    const result = await ctx.service.login.login(email_or_name, password);
    ctx.body = result;
  }
}
