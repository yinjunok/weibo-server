import { Controller } from 'egg';

export default class Images extends Controller {
  // type: avatar, cover, photo
  public async create() {
    const uploadType = ['avatar', 'cover', 'photo'];

    const { ctx } = this;
    const { type } = ctx.query;

    if (uploadType.indexOf(type) === -1) {
      ctx.body = {
        error_code: 1,
        message: '参数类型错误',
      };
      return;
    }

    const stream = await ctx.getFileStream();

    try {
      const result = await ctx.service.oss.upload(stream, `person/${ctx.userInfo.id}/${type}`);
      const record = await ctx.service.images.create({
        userId: ctx.userInfo.id,
        type,
        src: result.src,
        filename: result.filename,
      });
      ctx.body = {
        error_code: 0,
        message: '',
        data: {
          src: record.src,
          id: type === 'photo' ? record.id : null,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  public async destroy() {
    const { ctx } = this;
    const id = ctx.params.id;

    try {
      const res = await ctx.service.images.delete(id, ctx.userInfo.id);
      ctx.body = res;
    } catch (err) {
      throw err;
    }
  }
};
