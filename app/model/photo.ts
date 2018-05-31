import { Application } from 'egg';

export default (app: Application) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const photo = app.model.define('photo', {
    id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    post_id: {
      type: INTEGER.UNSIGNED,
      defaultValue: null,
      comment: '照片所属帖子 ID',
    },
    user_id: {
      type: INTEGER.UNSIGNED,
      comment: '照片所属用户 ID',
    },
    src: {
      type: STRING,
      comment: '照片保存在 app/public 下的相对地址',
    },
    filename: {
      type: STRING,
      comment: '照片上传时的原名',
    },
    created_at: {
      type: DATE,
    },
    updated_at: {
      type: DATE,
    },
  });

  return photo;
};
