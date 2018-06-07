import { Controller } from 'egg';

export default class User extends Controller {
  public async editAvatar() {
    const { ctx } = this;
    console.log(ctx.userInfo);
    ctx.body = ctx.userInfo;
  }

  public async editCover() {
    const { ctx } = this;

    ctx.body = '编辑封面';
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
