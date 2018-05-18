import { Controller } from 'egg';
import { isEmail } from 'validator';

interface FindResult {
  emailExist: boolean;
  nicknameExist: boolean;
}

// 注册结果响应
// interface RegRes {
//   error_code: number;
//   message: string;
// }

export default class Registered extends Controller {
  public async registered() {
    const { ctx } = this;
    const {
      email,
      nickname,
      password,
      passwordRepeat,
    } = ctx.request.body;

    if (!isEmail(email)) {
      ctx.body = {
        error_code: 1,
        message: '邮箱格式错误',
      };
      return;
    }

    if (password.length < 6) {
      ctx.body = {
        error_code: 1,
        message: '密码长度不能小于6位',
      };
      return;
    }

    if (password !== passwordRepeat) {
      ctx.body = {
        error_code: 1,
        message: '两次密码输入不一致',
      };
      return;
    }

    const result: FindResult = await ctx.service.registered.isExist(email, nickname);
    if (result.emailExist) {
      ctx.body = {
        error_code: 1,
        message: '邮箱已经注册',
      };
      return;
    }

    if (result.nicknameExist) {
      ctx.body = {
        error_code: 1,
        message: '昵称已经存在',
      };
      return;
    }
    try {
      await ctx.service.registered.registered(email, nickname, password);
      ctx.body = {
        error_code: 0,
        message: '注册成功',
      };
    } catch (err) {
      ctx.body = {
        error_code: 1,
        message: '未知错误',
      };
    }
  }
}
