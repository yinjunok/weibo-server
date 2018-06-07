import { Service } from 'egg';

export default class User extends Service {
  public async uploadImage(
    src: string,
    userId: number,
    type: string,
    filename?: string
  ) {
    if (type === 'avatar') {
      try {
        await this.app.model.User.update(
          {
            avatar: src,
          },
          {
            where: {
              id: userId,
            },
          },
        );
      } catch (err) {
        throw err;
      }
    }

    if (type === 'cover') {
      try {
        await this.app.model.User.update(
          {
            cover: src,
          },
          {
            where: {
              id: userId,
            },
          },
        );
      } catch (err) {
        throw err;
      }
    }

    if (type === 'photo') {
      try {
        await this.app.model.Photo.create(
          {
            user_id: userId,
            filename,
            src,
          },
        );
      } catch (err) {
        throw err;
      }
    }
  }
}
