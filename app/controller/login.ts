import { Controller } from 'egg';

export default class Login extends Controller {
  public async login() {
    const { ctx } = this;
    const {
      email_or_name,
      password,
    } = ctx.request.body;

    const result = await ctx.service.login.login(email_or_name, password);
    ctx.body = result;
  }
}
