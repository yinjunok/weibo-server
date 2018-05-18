import * as md5 from 'md5';

export default {
  addSalt(str: string): string {
    return md5(str);
  },
};
