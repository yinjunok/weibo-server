import { Application } from 'egg';

export default (app: Application) => {
  app.beforeStart(async () => {
    // await app.model.sync({ force: true });
    // await app.model.sync();
  });
};
