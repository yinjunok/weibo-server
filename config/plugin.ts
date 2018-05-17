import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  jwt: {
    enable: true,
    package: "egg-jwt",
  },
};

export default plugin;
