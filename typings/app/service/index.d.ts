// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Login from '../../../app/service/login';
import Registered from '../../../app/service/registered';
import Test from '../../../app/service/Test';
import Upload from '../../../app/service/upload';

declare module 'egg' {
  interface IService {
    login: Login;
    registered: Registered;
    test: Test;
    upload: Upload;
  }
}
