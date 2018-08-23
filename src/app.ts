import * as Koa from 'koa';
import * as mount from 'koa-mount';
import {
  UserManagementApi,
  UserManagementController,
} from './user_management';
import * as bodyParser from 'koa-bodyparser';
import { Auth0, Auth0Config } from './common/auth0';
import { CreateUserApi } from './user_management/api/create_user_api';

const config: Auth0Config = require('../config.json').auth0;
const auth0 = new Auth0(config);

const userController = new UserManagementController(auth0);
const createUserApi = new CreateUserApi(userController);

const userApi = new UserManagementApi(createUserApi);
const userRoutes = userApi.getRoutes();

const userAuthApi = new Koa();
userAuthApi.use(bodyParser());
userAuthApi.use(userRoutes);

const userAuthApp = mount('/users', userAuthApi);

export { auth0 };
export { userApi };
export { userController };
export { userAuthApp };
