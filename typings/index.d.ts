declare module 'egg' {
  import 'egg-sequelize';

  export interface Application {
    // jwt
    jwt: {
      // 加密
      sign(
        payload: string | Buffer | object,
        secretOrPrivateKey: string | Buffer | object,
        options?: SignOptions,
      ): string;

      // 验证
      verify(
        token: string,
        secretOrPublicKey: string | Buffer,
        options?: VerifyOptions,
      ): object | string;

      // 解密
      decode(
        token: string,
        options?: DecodeOptions,
    ): null | { [key: string]: any } | string;
    }
  }
}

declare module "stream-wormhole";
declare module 'await-stream-ready';
declare module 'stream-to-array';
declare module 'fs';
