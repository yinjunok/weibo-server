import { Application } from 'egg';

// post 回复模型
export default (app: Application) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const reply = app.model.define('reply', {
    id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    author_id: {
      type: INTEGER.UNSIGNED,
    },
    parent_id: {
      type: INTEGER.UNSIGNED,
      defaultValue: null,
      comment: '评论上层 id, null 为顶层评论',
    },
    post_id: {
      type: INTEGER.UNSIGNED,
      comment: '所属 post id',
    },
    content: {
      type: STRING,
    },
    reply_amount: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '如果是顶层评论回复数',
    },
    like_amount: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '点赞数量',
    },
    status: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '回复状态: 0 正常, 1 删除',
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

  return reply;
};
