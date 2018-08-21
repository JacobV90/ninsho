import * as Koa from 'koa';
import {
  Auth0Config,
  UserManagementApi,
  UserManagementController,
} from './user_management';
import * as bodyParser from 'koa-bodyparser';

const config: Auth0Config = require('../config.json').auth0;

const userAuthApi = new Koa();
const controller = new UserManagementController(config);
const userRoutes = new UserManagementApi(controller).getRoutes();

userAuthApi.use(bodyParser());
userAuthApi.use(userRoutes);

export { userAuthApi };
