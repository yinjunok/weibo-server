import { Service } from 'egg';
import { FileStream } from 'egg';
import { write as awaitWriteStream } from 'await-stream-ready';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as sendToWormhole from 'stream-wormhole';

export default class Upload extends Service {
  private readonly assetRoot: string;

  constructor (ctx) {
    super(ctx);
    this.assetRoot = path.join(this.config.baseDir, 'app/public');
  }

  /**
   *  保存文件, 并用 MD5 值改名
   */

  public async upload(stream: FileStream, dir: string) {
    const ext = path.extname(stream.filename).toLocaleLowerCase(); // 扩展名
    const filename = stream.filename;   // 文件原名
    // 文件存放的目标目录
    const target = path.join(
      this.assetRoot,
      dir,
    );

    // 文件存放路径
    const filePath = path.join(
      this.assetRoot,
      dir,
      `${Math.random().toString(36).substr(2)}${ext}`,
    );

    try {
      this.createDir(this.assetRoot, dir);
      const writeStream = fs.createWriteStream(filePath);
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      await sendToWormhole(stream);
      throw err;
    }

    // 计算文件 MD5
    let fileMD5;
    try {
      fileMD5 = await this.getFileMD5(filePath);
    } catch (err) {
      throw err;
    }

    // 改名
    const newPath = path.join(target, `${fileMD5}${ext}`);
    try {
      await this.fileRename(filePath, newPath);
    } catch (err) {
      return err;
    }

    return {
      filename,
      src: path.join('public', dir, `${fileMD5}${ext}`),
    };
  }

  private async getFileMD5(dir: string) {
    return new Promise((res) => {
      const stream = fs.createReadStream(dir);
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

  private async fileRename(oldPath: string, newPath: string) {
    return new Promise((res) => {
      fs.rename(oldPath, newPath, () => {
        res();
      });
    });
  }

  private createDir(current: string, pathStr: string): void {
    const pathArr: string[] = pathStr.split(/\//g);
    const road: string = path.join(current, pathArr[0]);

    try {
      fs.accessSync(road);
      if (pathArr.length > 1) {
        this.createDir(road, pathArr.slice(1).join('/'));
      }
    } catch (err) {
      fs.mkdirSync(road);
      if (pathArr.length > 1) {
        this.createDir(road, pathArr.slice(1).join('/'));
      }
    }
  }
}
