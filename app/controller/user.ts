import { Controller } from 'egg';
import { isEmail, isEmpty } from 'validator';

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
      await ctx.service.user.uploadImage({
        userId: ctx.userInfo.id,
        type,
        src: result.src,
        filename: result.filename,
      });
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

    const {
      email,
      nickname,
      personal_intro,
    } = ctx.request.body;

    if (email && !isEmail(email)) {
      ctx.body = {
        error_code: 1,
        message: '邮箱格式不正确',
      };
      return;
    }

    if (nickname && isEmpty(nickname)) {
      ctx.body = {
        error_code: 1,
        message: '昵称不能为空',
      };
      return;
    }

    try {
      const result = await ctx.service.user.editInfo({
        userId: ctx.userInfo.id,
        email,
        nickname,
        personalIntro: personal_intro,
      });

      ctx.body = result;
    } catch (err) {
      ctx.body = {
        error_code: 1,
        message: '未知错误',
      };
      throw err;
    }
  }

  public async changePassword() {
    const { ctx } = this;
    const {
      current,
      password,
      repeat,
    } = ctx.request.body;

    if (isEmpty(password)) {
      ctx.body = {
        error_code: 1,
        message: '密码不能为空',
      };
      return;
    }

    if (password.length < 6) {
      ctx.body = {
        error_code: 1,
        message: '密码长度不能小于 6 位',
      };
      return;
    }

    if (password !== repeat) {
      ctx.body = {
        error_code: 1,
        message: '两次密码输入不一致',
      };
      return;
    }

    try {
      const result = await ctx.service.user.changePassword(ctx.userInfo.id, current, password);
      ctx.body = result;
    } catch (err) {
      throw err;
    }
  }
}
