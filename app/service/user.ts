import { Service } from 'egg';

interface Edit {
  readonly userId: number;
  readonly email?: string;
  readonly nickname?: string;
  readonly personalIntro?: string;
}

export default class User extends Service {
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

  public async changePassword(userId: number, current: string, password: string) {
    const { app, helper } = this.ctx;
    try {
      const user = await app.model.User.findById(userId);

      if (user.password !== helper.addSalt(current + app.config.passwordSalt)) {
        return {
          error_code: 1,
          message: '当前密码不正确',
        };
      }

      await user.update({ password: helper.addSalt(password + app.config.passwordSalt) });
      return {
        error_code: 0,
        message: '修改密码成功',
      };
    } catch (err) {
      throw err;
    }
  }

  public async postOparating(userId: number, postId: number, type: string) {
    const { app: { model } } = this.ctx;

    try {
      const [ record ] = await model.UserPostRelation.findOrCreate({
        where: {
          user_id: userId,
          post_id: postId,
        },
      });
      switch (type) {
        case 'like':
          await record.update({
            like: record.like === 0 ? 1 : 0,
          });
          break;
        case 'collection':
          await record.update({
            collection: record.collection === 0 ? 1 : 0,
          });
          break;
        default:
          throw new Error('操作类型不存在');
      }
    } catch (err) {
      throw err;
    }
  }
}
