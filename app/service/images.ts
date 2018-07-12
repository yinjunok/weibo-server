import { Service } from 'egg';

interface UploadImage {
  readonly userId: number;
  readonly type: string;
  readonly src: string;
  readonly filename?: string;
}

export default class Images extends Service {
  public async create(params: UploadImage) {
    if (params.type === 'avatar') {
      try {
        await this.app.model.User.update(
          {
            avatar: params.src,
          },
          {
            where: {
              id: params.userId,
            },
          },
        );
      } catch (err) {
        throw err;
      }
    }

    if (params.type === 'cover') {
      try {
        await this.app.model.User.update(
          {
            cover: params.src,
          },
          {
            where: {
              id: params.userId,
            },
          },
        );
      } catch (err) {
        throw err;
      }
    }

    if (params.type === 'photo') {
      try {
        await this.app.model.Photo.create(
          {
            user_id: params.userId,
            filename: params.filename,
            src: params.src,
          },
        );
      } catch (err) {
        throw err;
      }
    }
  }

  public async delete(id, userId?: number) {
    const { app: { model }, ctx } = this;

    try {
      const record = await model.Photo.find({
        where: {
          id,
        },
      });

      if (record === null) {
        return {
          error_code: 1,
          message: '照片已经被删除',
        };
      }

      if (record.user_id !== userId) {
        return {
          error_code: 1,
          message: '无法删除不属于自己的照片',
        };
      }
      await ctx.service.oss.delete(record.src.replace(this.config.ossPrefix, ''));
      record.destroy();
      return {
        error_code: 0,
        message: '删除成功',
      };
    } catch (err) {
      return {
        error_code: 1,
        message: '未知错误, 请重试',
      }
    }
  }
};
