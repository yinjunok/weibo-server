import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.post('/api/v1/registered', controller.registered.registered);
  router.post('/api/v1/login', controller.login.login);
  router.post('/api/v1/upload', controller.home.upload);
  router.get('/api/v1/auth', controller.home.index);
  router.resources('post', '/api/v1/auth/post', controller.post);
  router.post('/api/v1/auth/user/edit/avatar', controller.user.editAvatar);
  router.post('/api/v1/auth/user/edit/cover', controller.user.editCover);
  router.post('/api/v1/auth/user/edit/info', controller.user.editInfo);
  router.post('/api/v1/auth/user/edit/info', controller.user.editPassword);
};
