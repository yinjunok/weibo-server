import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = 'hello world';
  }

  public async upload() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();

    let src;
    try {
      src = await ctx.service.upload.upload(stream, 'person/1231564');
      console.log('控制器', src);
    } catch (err) {
      console.log('控制器err',err);
    }

    this.ctx.body = src;
  }
}
