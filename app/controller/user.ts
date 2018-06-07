import { Controller } from 'egg';

export default class User extends Controller {
  /**
   *  type: avatar, cover, photo
   */
  public async uploadImage() {
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
      const result = await ctx.service.upload.upload(stream, `person/${ctx.userInfo.id}`);
      await ctx.service.user.uploadImage(result.src, ctx.userInfo.id, type, result.filename);
      ctx.body = {
        error_code: 0,
        message: '',
      };
    } catch (err) {
      throw err;
    }
  }

  public async editInfo() {
    const { ctx } = this;

    ctx.body = '编辑个人信息';
  }

  public async editPassword() {
    const { ctx } = this;

    ctx.body = '编辑密码';
  }
}
