import * as md5 from 'md5';

export default {
  addSalt(str: string): string {
    return md5(str);
  },
  deleProp(obj: object, fields: string[]): object {
    const keys = Object.keys(obj);
    const result = {};

    keys.forEach((key) => {
      if (!fields.includes(key)) {
        result[key] = obj[key];
      }
    });
    return result;
  },
};
