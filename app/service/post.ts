import { Service } from 'egg';

export default class Post extends Service {
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
        return 1;
      }
    } catch (err) {
      throw err;
    }
  }
}
