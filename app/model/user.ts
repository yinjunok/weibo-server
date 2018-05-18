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
    },
    password: {
      type: STRING,
    },
    avatar: {
      type: STRING,
    },
    created_at: {
      type: DATE,
    },
    updated_at: {
      type: DATE,
    },
    cover: {
      type: STRING,
    },
    status: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    fans_amount: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    follow_amount: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    personal_intro: {
      type: STRING,
    },
    sex: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: [ 'email', 'nickname' ],
      },
    ]
  },
);

  return user;
};
