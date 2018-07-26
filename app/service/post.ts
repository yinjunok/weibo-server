import { Service } from 'egg';

// {
//   author,
//   post,
//   relation: {
//     like,
//     collection,
//   },
//   photo,
//   reference: {
//     post,
//     author,
//     photo,
//   },
// }

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

      const postIds = postList
                        .map((p) => p.reference_post_id)
                        .filter((id) => id !== null)
                        .concat(referenceId.filter((id) => id !== null));

      console.log(postIds);
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

  public async newIndex(userId: number, page: number = 1, limit: number = 20) {
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
    // private async getListByPostId(postId: number[]) {
  //   const { model } = this.ctx.app;

  //   try {
  //     const record = await model.Post.findAll({
  //       where: {
  //         id: postId,
  //         status: 0,
  //       },
  //     });

  //     const result = record.map((r) => r.dataValues);
  //     const authors = await this.getAuthorInfo(result.map((r) => r.author_id));

  //     return [result, authors];
  //   } catch (err) {
  //     throw err;
  //   }
  // }
}
