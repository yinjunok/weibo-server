// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Home from '../../../app/controller/home';
import Login from '../../../app/controller/login';
import Registered from '../../../app/controller/registered';

declare module 'egg' {
  interface IController {
    home: Home;
    login: Login;
    registered: Registered;
  }
}
