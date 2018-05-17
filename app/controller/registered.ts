import { Controller } from 'egg';
import {
  isEmail,
} from 'validator';

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
      ctx.body = '密码格式错误';
      return;
    }

    if (password.length < 6) {
      ctx.body = '密码长度不能小于6位';
      return;
    }

    if (password !== passwordRepeat) {
      ctx.body = '两次密码输入不一致';
      return;
    }

    const result: FindResult = await ctx.service.user.isExist(email, nickname);
    if (result.emailExist) {
      ctx.body = '邮箱已经注册';
      return;
    }

    if (result.nicknameExist) {
      ctx.body = '昵称已经存在';
      return;
    }

    await ctx.service.user.registered(email, nickname);
    ctx.body = '注册成功';
  }
}
