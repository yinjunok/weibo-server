import { Controller } from 'egg';

export default class Login extends Controller {
  public async login() {
    const { ctx } = this;
    const {
      username,
      password,
    } = ctx.request.body;

    const result = await ctx.service.login.login(username, password);
    ctx.body = result;
  }
}
