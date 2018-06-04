import { Controller } from 'egg';
import { isEmpty } from 'validator';

// interface RequestPost {
//   reference_post_id: number;
//   content: string;
//   photo: number[];
// }

export default class Post extends Controller {
  public async index() {
    const { ctx } = this;
    const {
      page,
      limit,
    } = ctx.request.query;

    const nPage = page ? parseInt(page, 10) : 1;
    const nLimit = limit ? parseInt(limit, 10) : 20;

    const userInfo = this.getUserInfo();

    let result;
    try {
      result = await ctx.service.post.index(userInfo.id, nPage, nLimit);
    } catch (err) {
      throw err;
    }
    ctx.body = result;
  }

  public async create() {
    const { ctx } = this;

    const {
      reference,
      content,
    } = ctx.request.body;

    let { photo } = ctx.request.body;
    if (typeof photo === 'string') {
      photo = [photo];
    }

    if (isEmpty(content)) {
      ctx.body = {
        error_code: 1,
        message: '内容不能为空',
      };
    }

    const userInfo: any = this.getUserInfo();

    try {
      await ctx.service.post.create(
        userInfo.id,
        content,
        reference,
        photo,
      );
    } catch (err) {
      ctx.body = {
        error_code: 1,
        message: '未知错误',
      };
      ctx.response.status = 500;
    }

    ctx.body = {
      error_code: 1,
      message: '发布成功',
    };
  }

  public async destroy() {
    const { ctx } = this;

    const userInfo: any = this.getUserInfo();
    const postId = ctx.params.id;

    try {
      await ctx.service.post.delete(postId, userInfo.id + 1);
      ctx.body = {
        error_code: 0,
        message: '删除成功',
      };
    } catch (err) {
      ctx.body = {
        error_code: 1,
        message: '未知错误',
      };
      ctx.response.status = 500;
    }
  }

  private getUserInfo() {
    const { ctx } = this;

    const token = ctx.request.header['authorization'].replace(/^Bearer\s{1}/, '');
    const userInfo: any = ctx.app.jwt.decode(token);
    return userInfo;
  }
}
