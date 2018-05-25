import { Service } from 'egg';
import { FileStream } from 'egg';
import { write as awaitWriteStream } from 'await-stream-ready';
import * as fs from 'fs';
import * as path from 'path';
// import * as crypto from 'crypto';
import * as sendToWormhole from 'stream-wormhole';

interface Save {
  src: string;
  originName: string;
}

export default class Upload extends Service {
  public async upload(stream: FileStream, dir: string): Promise<Save> {
   // const ext = path.extname(stream.filename);
    const originName = stream.filename;
    const baseDir = path.join(this.config.baseDir, `app/public/${dir}`);
    const target = path.join(
      this.config.baseDir,
      `app/public/${baseDir}`,
      `${Math.random().toString(36).substr(2)}`,
    );
    try {
      const r = await this.createDir(baseDir);
      console.log(r);
    } catch (err) {
      console.log(err);
    }

    try {
      const writeStream = fs.createWriteStream(target);
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      await sendToWormhole(stream);
      throw err;
    }

    return {
      originName,
      src: target,
    };
  }

  // 获取文件 MD5
  // private getFileMD5(stream: FileStream): Promise<string> {
  //   return new Promise((res) => {
  //     const fsHash = crypto.createHash('md5');
  //     stream.on('data', (d) => {
  //       fsHash.update(d);
  //     });

  //     stream.on('end', () => {
  //       const md5 = fsHash.digest('hex');
  //       res(md5);
  //     });
  //   });
  // }

  private dirExist(dir: string) {
    return new Promise((res) => {
      fs.access(dir, fs.constants.W_OK, (err) => {
        if (err.code === 'ENOENT') {
          res(false);
        }
        res(true);
      });
    });
  }

  private async createDir(dir: string) {
    try {
      const dirExist = await this.dirExist(dir);
      if (dirExist) {
        return true;
      } else {
        await new Promise((res, rej) => {
          fs.mkdir(dir, (err) => {
            if (err) {
              rej(err);
            } else {
              res(true);
            }
          });
        });
      }

    } catch (err) {
      throw err;
    }
  }
}
