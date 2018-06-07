import { Context } from 'egg';

export default () => {
  return async (ctx: Context, next: () => Promise<any>) => {
    const token = ctx.request.header['authorization'].replace(/^Bearer\s{1}/, '');
    const userInfo: any = ctx.app.jwt.decode(token);
    ctx.userInfo = userInfo;
    await next();
  };
};
