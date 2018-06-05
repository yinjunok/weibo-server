import { Application } from 'egg';

export default (app: Application) => {
  const { INTEGER, DATE } = app.Sequelize;

  const postPhoto = app.model.define('post_photo', {
    post_id: {
      type: INTEGER.UNSIGNED,
      comment: '帖子 ID',
      primaryKey: true,
    },
    photo_id: {
      type: INTEGER.UNSIGNED,
      comment: '图片 ID',
      primaryKey: true,
    },
    created_at: {
      type: DATE,
    },
    updated_at: {
      type: DATE,
    },
  }, {
    indexes: [
      {
        fields: [ 'post_id' ],
      },
    ],
  });

  return postPhoto;
};
