import { DefaultConfig } from './config.default';
import * as ossConfig from './secret';

export default () => {
  const config: DefaultConfig = {
    sequelize : {
      dialect: 'mysql',
      database: 'weibo_dev',
      host: '101.132.127.147',
      port: '3306',
      username: '@weibo_dev',
      password: 'weibo_DEV@1234',
      timezone: '+08:00',
    },
    security: {
      csrf: {
        enable: false,
      },
    },
    jwt: {
      secret: 'you dont know me',
      match: '/api/v1/auth',
      enable: true,
    },
    parsetoken: {
      match: '/api/v1/auth',
      enable: true,
    },
    passwordSalt: 'password secret', // 密码加盐
    ossPrefix: 'http://weibo-dev.oss-cn-beijing.aliyuncs.com/',
    ossConfig,
  };

  return config;
};
