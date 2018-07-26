import { Application } from 'egg';

export default (app: Application) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const post = app.model.define('post', {
    id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    author_id: {
      type: INTEGER.UNSIGNED,
    },
    reference_post_id: {
      type: INTEGER.UNSIGNED,
      comment: '转发引用的 id',
    },
    content: {
      type: STRING,
    },
    reply_amount: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '回复数量',
    },
    reference_amount: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '转发数',
    },
    like_amount: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '点赞数量',
    },
    status: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '帖子状态: 0 正常, 1 存草稿',
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
        fields: [ 'content', 'author_id' ],
      },
    ]
  },
);

  return post;
};
