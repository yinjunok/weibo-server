import { Application } from 'egg';

export default (app: Application) => {
  const { INTEGER, DATE } = app.Sequelize;

  const userRelation = app.model.define('user_relation', {
    follower_id: {
      type: INTEGER.UNSIGNED,
    },
    followed_id: {
      type: INTEGER.UNSIGNED,
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
  // {
  //   indexes: [
  //     {
  //       unique: true,
  //       fields: [ 'email', 'nickname' ],
  //     },
  //   ]
  // },
);

  return userRelation;
};
