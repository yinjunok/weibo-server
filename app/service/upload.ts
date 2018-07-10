import { Service } from 'egg';
import * as path from 'path';
import * as fs from 'fs';
import { write as awaitWriteStream } from 'await-stream-ready';
import * as sendToWormhole from 'stream-wormhole';
import * as crypto from 'crypto';
import { FileStream } from 'egg';
import { Wrapper as OSS } from 'ali-oss';   // OSS 文档: https://github.com/ali-sdk/ali-oss

export default class Upload extends Service {
  private readonly tempPath: string;

  constructor (ctx) {
    super(ctx);
    this.tempPath = path.join(this.config.baseDir, 'app/public/temp');
  }

  public async upload(fileStream: FileStream, dir: string) {
    const filename = fileStream.filename;
    const ext = path.extname(filename).toLocaleLowerCase();
    const fileTempPath = path.join(this.tempPath, `${Math.random().toString(36).substr(2)}${ext}`);
    const tempFile = fs.createWriteStream(fileTempPath);

    try {
      await awaitWriteStream(fileStream.pipe(tempFile));
    } catch (err) {
      await sendToWormhole(fileStream);
      throw err;
    }

    let ossResponse;
    try {
      const md5 = await this.calcMD5(fileTempPath);
      const client = new OSS(this.config.ossConfig.default);
      ossResponse = await client.putStream(`${dir}/${md5}${ext}`, fs.createReadStream(fileTempPath), {
        headers: {
          'x-oss-object-acl': 'public-read',
        },
      });
      fs.unlinkSync(fileTempPath);
    } catch (err) {
      throw err;
    }

    return {
      filename,
      src: ossResponse.url,
    };
  }

  private async calcMD5(target: string) {
    return new Promise((res) => {
      const stream = fs.createReadStream(target);
      const fsHash = crypto.createHash('md5');
      stream.on('data', (d) => {
        fsHash.update(d);
      });
      stream.on('end', () => {
        const md5 = fsHash.digest('hex');
        res(md5);
      });
    });
  }
}
