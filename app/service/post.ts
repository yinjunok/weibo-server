import { Service } from 'egg';

export default class Post extends Service {
  public async getList(page: number = 1, limit: number = 20, userId?: number) {
    const { app } = this.ctx;
    
    console.log(userId, page, limit, app);
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

/*
{
    "error_code": 0,
    "message": "",
    "data": [
        {
            "id": 4,
            "author_id": 12,
            "reference_post_id": null,
            "content": "第二条消息发送扥甲A龙",
            "reply_amount": 0,
            "like_amount": 0,
            "status": 0,
            "created_at": "2018-07-11T02:19:09.000Z",
            "updated_at": "2018-07-11T02:19:09.000Z",
            "author": {
                "id": 12,
                "email": "123456@qq.com",
                "nickname": "437845",
                "avatar": null,
                "cover": null,
                "status": 0,
                "fans_amount": 0,
                "follow_amount": 0,
                "personal_intro": null,
                "sex": 0
            },
            "photos": [],
            "reference": null,
            "collection": 0,
            "like": 0
        }
    ],
    "page": 1,
    "limit": 20,
    "total": 1
}
*/