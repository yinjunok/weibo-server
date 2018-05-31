import { Application } from 'egg';

export default (app: Application) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const user = app.model.define('user', {
    id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: STRING,
      unique: true,
    },
    nickname: {
      type: STRING,
      unique: true,
      comment: '用户昵称',
    },
    password: {
      type: STRING,
      comment: 'MD5 加盐过的密码',
    },
    avatar: {
      type: STRING,
      comment: '用户头像地址',
    },
    cover: {
      type: STRING,
      comment: '用户封面',
    },
    status: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '用户状态: 0 正常, 1 封印',
    },
    fans_amount: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '粉丝数',
    },
    follow_amount: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '关注的人数',
    },
    personal_intro: {
      type: STRING,
      comment: '个人简介',
    },
    sex: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '性别: 0 未知, 1 男, 2 女',
    },
    created_at: {
      type: DATE,
    },
    updated_at: {
      type: DATE,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: [ 'email', 'nickname' ],
      },
    ],
  },
);

  return user;
};
