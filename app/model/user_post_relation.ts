import { Application } from 'egg';

// 用户帖子关系模型
export default (app: Application) => {
  const { INTEGER, DATE } = app.Sequelize;

  const userPostRelation = app.model.define('user_post_relation', {
    user_id: {
      type: INTEGER.UNSIGNED,
    },
    post_id: {
      type: INTEGER.UNSIGNED,
    },
    like: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '点赞状态: 0 正常, 1 点赞',
    },
    collection: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '收藏状态: 0 正常, 1 收藏',
    },
    created_at: {
      type: DATE,
    },
    updated_at: {
      type: DATE,
    },
  },
);

  return userPostRelation;
};
