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
    },
    content: {
      type: STRING,
    },
    reply_amount: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    like_amount: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    status: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
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
