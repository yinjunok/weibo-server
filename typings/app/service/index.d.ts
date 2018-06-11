// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Login from '../../../app/service/login';
import Post from '../../../app/service/post';
import Registered from '../../../app/service/registered';
import Reply from '../../../app/service/reply';
import Test from '../../../app/service/Test';
import Upload from '../../../app/service/upload';
import User from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    login: Login;
    post: Post;
    registered: Registered;
    reply: Reply;
    test: Test;
    upload: Upload;
    user: User;
  }
}
