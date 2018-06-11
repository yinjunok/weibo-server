import { Service } from 'egg';

interface ReplyParams {
  readonly postId: number;
  readonly authorId: number;
  readonly content: string;
  readonly parentId?: number | undefined;
}

export default class Reply extends Service {
  public async create(params: ReplyParams): Promise<any> {
    const { app } = this.ctx;

    try {
      const record = await app.model.Reply.create({
        post_id: params.postId,
        author_id: params.authorId,
        content: params.content,
        parent_id: params.parentId ? params.parentId : null,
      });
      return {
        id: record.id,
        authorId: record.author_id,
        content: record.content,
        parentId: record.parent_id,
      };
    } catch (err) {
      throw err;
    }
  }
}
