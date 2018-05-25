import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.test.sayHi('egg');
  }

  public async upload() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();

    let src;
    try {
      src = await ctx.service.upload.upload(stream, 'phoo');
      console.log(src);
    } catch (err) {
      console.log(err);
    }

    this.ctx.body = src;
  }
}
