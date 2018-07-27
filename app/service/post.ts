import { Service } from 'egg';

export default class Post extends Service {
  public async index(userId: number, page: number = 1, limit: number = 20) {
    const { model } = this.ctx.app;

    // 获取关注的人 id
    const following = await model.UserRelation.findAll({
      where: {
        user_id: userId,
        status: 1,
      },
      attributes: ['another_user_id'],
    });
    const followingIds = following.map((f) => f.dataValues.another_user_id);

    // 获取第一层 post
    const posts = await this.getPostByUser([...followingIds, userId], page, limit, userId);

    let referenceIds = posts.list.map((p) => p.reference_post_id);
    referenceIds = referenceIds.reduce((result, cur) => {
      if (result.indexOf(cur) === -1) {
        result.push(cur);
      }
      return result;
    }, []);

    const referencePost = await this.getListByPostId(referenceIds);
    // 组装数据
    posts.list = posts.list.map((p) => {
      for (const v of referencePost) {
        p.reference = null;
        if (v.id === p.reference_post_id) {
          p.reference = v;
        }
      }
      return p;
    });
    return posts;
  }

  public async create(
    user: string,
    content: string,
    reference: string | undefined,
    photo: string[] | undefined,
  ) {
    const { app } = this.ctx;

    let newPost;
    try {
      newPost = await app.model.Post.create({
        content,
        author_id: user,
        reference_post_id: reference ? reference : null,
      });
    } catch (err) {
      throw err;
    }

    if (photo) {
      const photoModel = photo.map((photoItem) => {
        return {
          post_id: newPost.id,
          photo_id: photoItem,
        };
      });

      try {
        await Promise.all([
          app.model.Photo.update(
            { post_id: newPost.id },
            {
              where: {
                id: photo,
              },
            },
          ),
          app.model.PostPhoto.bulkCreate(photoModel)
        ]);
      } catch (err) {
        throw err;
      }
    }
  }

  public async delete(postId: number, userId: number) {
    const { app } = this.ctx;

    try {
      const result = await app.model.Post.findById(postId);

      if (result.author_id === userId) {
        await app.model.Post.update(
          {
            status: 1,
          },
          {
            where: {
              id: postId,
            },
          },
        );
      } else {
        throw new Error('不能删除不属于自己的帖子');
      }
    } catch (err) {
      throw err;
    }
  }

  private async getPostByUser(authorId: number[], page: number = 1, limit: number = 20, userId: number) {
    const { model } = this.ctx.app;

    try {
      const [list, total] = await Promise.all([
        model.Post.findAll({
          where: {
            author_id: authorId,
            status: 0,
          },
          order: [['created_at', 'DESC']],
          offset: (page - 1) * limit,
          limit,
        }),
        model.Post.findAll({
          where: {
            author_id: authorId,
            status: 0,
          },
          attributes: [[model.fn('COUNT', model.col('*')), 'total']],
        }),
      ]);

      let result = list.map((r) => r.dataValues);
      const authors = await this.getAuthorInfo(result.map((r) => r.author_id));

      const postIds = result.map((r) => r.id)
      const userPostRelation = await this.getUserPostRelation(userId, postIds);
      const photo = await this.getPhotoByPost(postIds);

      // 组装数据
      result = result.map((post) => {
        for (const val of authors) {
          if (val.id === post.author_id) {
            post.author = val;
          }
        }

        post.photo = [];
        for (const val of photo) {
          if (val.post_id === post.id) {
            post.photo.push(val);
          }
        }

        post.like = false;
        post.collection = false;
        for (const val of userPostRelation) {
          if (val.post_id === post.id) {
            post.like = val.like === 1;
            post.collection = val.collection === 1;
          }
        }
        return post;
      });

      return {
        limit,
        page,
        total: total.total,
        list: result,
      };
    } catch (err) {
      throw err;
    }
  }

  private async getAuthorInfo(author: number[]) {
    const { model } = this.ctx.app;

    try {
      const record = await model.User.findAll({
        where: {
          id: author,
        },
        attributes: {
          exclude: ['password', 'created_at', 'updated_at']
        },
      });

      return record.map((a) => a.dataValues);
    } catch (err) {
      throw err;
    }
  }

  private async getUserPostRelation(userId: number, postId: number[]) {
    const { model } = this.ctx.app;

    try {
      const record = await model.UserPostRelation.findAll({
        where: {
          user_id: userId,
          post_id: postId,
        },
      });

      return record.map((r) => r.dataValues);
    } catch (err) {
      throw err;
    }
  }

  private async getPhotoByPost(postId: number[]) {
    const { model } = this.ctx.app;
    try {
      const record = await model.Photo.findAll({
        where: {
          post_id: postId,
        },
      });

      return record.map((r) => r.dataValues);
    } catch (err) {
      throw err;
    }
  }
  private async getListByPostId(postId: number[]) {
    const { model } = this.ctx.app;

    try {
      const record = await model.Post.findAll({
        where: {
          id: postId,
          status: 0,
        },
      });

      let result = record.map((r) => r.dataValues);
      const authors = await this.getAuthorInfo(result.map((r) => r.author_id));
      result = result.map((r) => {
        for (const v of authors) {
          if (r.author_id === v.id) {
            r.author = v;
          }
        }
        return r;
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}
