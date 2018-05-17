import { DefaultConfig } from './config.default';

export default () => {
  const config: DefaultConfig = {
    sequelize : {
      dialect: 'mysql',
      database: 'weibo_dev',
      host: '101.132.127.147',
      port: '3306',
      username: '@weibo_dev',
      password: 'weibo_DEV@1234',
    },
    security: {
      csrf: {
        enable: false,
      },
    },
    jwt: {
      secret: 'you dont know me',
      match: '/api/v1/auth',
    },
    password: 'password secret',
  };

  return config;
};
