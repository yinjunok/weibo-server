// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Images from '../../../app/service/images';
import Login from '../../../app/service/login';
import Oss from '../../../app/service/oss';
import Post from '../../../app/service/post';
import Registered from '../../../app/service/registered';
import Reply from '../../../app/service/reply';
import Test from '../../../app/service/Test';
import User from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    images: Images;
    login: Login;
    oss: Oss;
    post: Post;
    registered: Registered;
    reply: Reply;
    test: Test;
    user: User;
  }
}
