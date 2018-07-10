import { Application } from 'egg';
import * as makeDir from 'make-dir';

export default (app: Application) => {
  app.beforeStart(async () => {
    // await app.model.sync({ force: true });
    // await app.model.sync();
    await makeDir('app/public/temp');
  });
};
