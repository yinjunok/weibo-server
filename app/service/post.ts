import { Service } from 'egg';

export default class Post extends Service {
  public async index(userId: number, page: number = 1, limit: number = 20) {
    const { app } = this.ctx;
    try {
      // 关注的人
      let following = await app.model.UserRelation.findAll({
        where: {
          user_id: userId,
          status: [1],
        },
      });
      following = following.map((f) => f.another_user_id);

      // 直接的 post
      const [postList, total] = await Promise.all([
        app.model.Post.findAll({
          where: {
            author_id: [...following, userId],
            status: [0],
          },
          order: [['created_at', 'DESC']],
          offset: (page - 1) * limit,
          limit,
        }),
        app.model.Post.findAll({
          where: {
            author_id: [...following, userId],
            status: [0],
          },
          attributes: [[app.model.fn('COUNT', app.model.col('*')), 'total']],
        }),
      ]);

      // 引用的 post
      const referenceId = postList.map((p) => p.reference_post_id);
      const referencePost = await app.model.Post.findAll({
        where: {
          id: referenceId,
          status: [0],
        },
      });

      const postIds = postList.map((p) => p.reference_post_id).concat(referenceId);
      let photoIds = await app.model.PostPhoto.findAll({
        where: {
          post_id: postIds,
        },
      });
      photoIds = photoIds.map((p) => p.photo_id);

      // 作者信息
      let authorId = referencePost.map((p) => p.author_id).concat(following, [userId]);

      // 作者 id 数组去重.
      authorId = authorId.reduce((acc, cur) => {
        if (acc.indexOf(cur) === -1) {
          return [...acc, cur];
        }
        return acc;
      }, []);

      const [authors, photos, postRelation] = await Promise.all([
        app.model.User.findAll({
          where: {
            id: authorId,
          },
          attributes: { exclude: ['password', 'created_at', 'updated_at'] },
        }),
        app.model.Photo.findAll({
          where: {
            id: photoIds,
          },
        }),
        app.model.UserPostRelation.findAll({
          where: {
            post_id: postIds,
          },
        }),
      ]);

      // 组装数据
      for (const val of postList) {
        val.dataValues.author = null;
        val.dataValues.photos = [];
        val.dataValues.reference = null;
        val.dataValues.collection = 0;
        val.dataValues.like = 0;
      }

      for (const val of referencePost) {
        val.dataValues.author = null;
        val.dataValues.photos = [];

        for (const v of postList) {
          if (v.reference_post_id === val.id) {
            v.dataValues.reference = val;
          }
        }
      }

      for (const val of authors) {
        for (const val2 of postList) {
          if (val2.author_id === val.id) {
            val2.dataValues.author = val;
          }
        }

        for (const val3 of referencePost) {
          if (val3.author_id === val.id) {
            val3.dataValues.author = val;
          }
        }
      }

      for (const val of photos) {
        for (const val2 of postList) {
          if (val2.id === val.post_id) {
            val2.dataValues.photos.push(val);
          }
        }

        for (const val3 of referencePost) {
          if (val3.author_id === val.id) {
            val3.dataValues.photos.push(val);
          }
        }
      }

      for (const val of postRelation) {
        for (const v of postList) {
          if (v.id === val.post_id) {
            v.dataValues.collection = v.collection;
            v.dataValues.like = v.like;
          }
        }
      }

      return {
        postList,
        total: total[0].dataValues.total,
        page,
        limit,
      };
    } catch (err) {
      throw err;
    }
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
        await app.model.PostPhoto.bulkCreate(photoModel);
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
}
