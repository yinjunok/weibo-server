import { Application } from 'egg';

export default (app: Application) => {
  const { INTEGER, DATE } = app.Sequelize;

  const userRelation = app.model.define('user_relation', {
    user_id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      comment: '操作者的 id',
    },
    another_user_id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      comment: '被操作者的 id',
    },
    status: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '状态: 0 正常, 1 关注, 2 黑名单',
    },
    created_at: {
      type: DATE,
    },
    updated_at: {
      type: DATE,
    },
  },
);

  return userRelation;
};
