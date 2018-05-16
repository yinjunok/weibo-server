import { Controller } from 'egg';

export default class Registered extends Controller {
  public async create() {
    const { ctx } = this;
    const result = await ctx.service.user.create('1', '2', '3');
    console.log(result);
    ctx.body = '成功';
  }
}