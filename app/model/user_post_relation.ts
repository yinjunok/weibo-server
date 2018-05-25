import { Application } from 'egg';

export default (app: Application) => {
  const { INTEGER, DATE } = app.Sequelize;

  const reply = app.model.define('reply', {
    user_id: {
      type: INTEGER.UNSIGNED,
    },
    post_id: {
      type: INTEGER.UNSIGNED,
    },
    like: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    collection: {
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
);

  return reply;
};
