// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Parsetoken from '../../../app/middleware/parsetoken';

declare module 'egg' {
  interface IMiddleware {
    parsetoken: ReturnType<typeof Parsetoken>;
  }
}
