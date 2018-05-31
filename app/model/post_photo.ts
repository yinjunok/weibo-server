import { Application } from 'egg';

export default (app: Application) => {
  const { INTEGER, DATE } = app.Sequelize;

  const postPhoto = app.model.define('post_photo', {
    post_id: {
      type: INTEGER.UNSIGNED,
      defaultValue: null,
      comment: '帖子 ID',
    },
    photo_id: {
      type: INTEGER.UNSIGNED,
      comment: '图片 ID',
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
