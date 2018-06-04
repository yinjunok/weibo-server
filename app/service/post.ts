import { Service } from 'egg';

// type PostType {
//   id,
//   author_id,
//   .
//   .
//   .
//   reference: {},
//   author: {}
// };

export default class Post extends Service {
  public async index(userId: number, page: number = 1, limit: number = 20) {
    const { app } = this.ctx;

    try {
      // 查询关注的人 id;
      const following = await app.model.UserRelation.findAll({
        where: {
          user_id: userId,
          status: 1,
        },
        attributes: ['another_user_id'],
      });

      // 获取关注的人 ID
      const anotherUserIds = following.map((user) => user.another_user_id);

      // 查询 post 作者信息
      const author = await app.model.User.findAll({
        where: {
          id: [...anotherUserIds, userId],
        },
        attributes: { exclude: ['password', 'created_at', 'updated_at'] },
      });

      // 查询首页 post
      const post = await app.model.Post.findAll({
        offset: (page - 1) * limit,
        limit,
        order: [['created_at', 'DESC']],
        where: {
          author_id: [...anotherUserIds, userId],
          status: [0],
        },
        attributes: { include: [[app.model.fn('COUNT', app.model.col('*')), 'total']] },
      });

      // 查询 post 引用的 post
      const referenceId = post.map((p) => p.reference_post_id);
      const referencePost = await app.model.Post.findAll({
        where: {
          id: [...referenceId],
        },
      });

      // 组装搜索结果
      const result = post.map((p) => {
        let pAuthor = null;
        let pReference = null;

        for (const val of author) {
          if (p.author_id === val.id) {
            pAuthor = val.dataValues;
            break;
          }
        }

        for (const val of referencePost) {
          if (p.reference_post_id === val.id) {
            pReference = val.dataValues;
            break;
          }
        }

        return {
          ...p.dataValues,
          reference: pReference,
          author: pAuthor,
        };
      });

//      console.log(result);

      return result;
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
