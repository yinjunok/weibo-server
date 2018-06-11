import { Controller } from 'egg';

export default class Reply extends Controller {
  public async create() {
    const { ctx } = this;
    const {
      post_id,
      content,
      parent_id,
    } = ctx.request.body;

    try {
      const res = await ctx.service.reply.create({
        postId: post_id,
        authorId: ctx.userInfo.id,
        content,
        parentId: parent_id,
      });

      ctx.body = res;
    } catch (err) {
      throw err;
    }
  }
}
