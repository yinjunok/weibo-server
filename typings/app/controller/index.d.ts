// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Home from '../../../app/controller/home';
import Login from '../../../app/controller/login';
import Post from '../../../app/controller/post';
import Registered from '../../../app/controller/registered';
import Reply from '../../../app/controller/reply';
import User from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    home: Home;
    login: Login;
    post: Post;
    registered: Registered;
    reply: Reply;
    user: User;
  }
}
