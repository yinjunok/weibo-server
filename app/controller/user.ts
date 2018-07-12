import { Controller } from 'egg';
import { isEmail, isEmpty } from 'validator';

export default class User extends Controller {
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

  public async postOparating() {
    const { ctx } = this;
    const actionTypes = ['like', 'collection'];
    const { type, post_id } = ctx.request.body;

    if (actionTypes.indexOf(type) === -1) {
      ctx.body = {
        error_code: 1,
        message: '参数错误',
      };
      return;
    }

    try {
      await ctx.service.user.postOparating(ctx.userInfo.id, post_id, type);
      ctx.body = {
        error_code: 0,
        message: '',
      };
    } catch (err) {
      ctx.body = {
        error_code: 1,
        message: '未知错误',
      };
    }
  }
}
