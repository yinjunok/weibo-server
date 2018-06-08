import { Service } from 'egg';

interface Edit {
  readonly userId: number;
  readonly email?: string;
  readonly nickname?: string;
  readonly personalIntro?: string;
}

interface UploadImage {
  readonly userId: number;
  readonly type: string;
  readonly src: string;
  readonly filename?: string;
}

export default class User extends Service {
  public async uploadImage (params: UploadImage) {
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

  public async editInfo (params: Edit) {
    const { app } = this.ctx;
    const user = await app.model.User.findById(params.userId);

    if (params.email) {
      try {
        await user.update({
          email: params.email,
        });
      } catch (err) {
        return {
          error_code: 1,
          message: '邮箱已被使用',
        };
      }
    }

    if (params.nickname) {
      try {
        await user.update({
          nickname: params.nickname,
        });
      } catch (err) {
        return {
          error_code: 1,
          message: '昵称已被占用',
        };
      }
    }

    if (params.personalIntro) {
      try {
        await user.update({
          personal_intro: params.personalIntro,
        });
      } catch (err) {
        return {
          error_code: 1,
          message: '未知错误',
        };
      }
    }

    return {
      error_code: 0,
      message: '',
    };
  }
}
