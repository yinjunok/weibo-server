import * as md5 from 'md5';

function addSalt(str: string): string {
  return md5(str);
}

export default addSalt;
