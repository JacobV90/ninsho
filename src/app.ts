import * as Koa from 'koa';
import * as mount from 'koa-mount';
import {
  UserManagementApi,
  UserManagementController,
} from './user_management';
import * as bodyParser from 'koa-bodyparser';
import { Auth0, Auth0Config } from './common/auth0';
import { CreateUserApi } from './user_management/api/create_user_api';

export class Ninsho extends Koa {
  public userApi: UserManagementApi;
  public auth0: Auth0;
  public userManagement: UserManagementController;
  private prefix: string;

  constructor(config: Auth0Config, prefix?: string) {
    super();
    this.auth0 = new Auth0(config);
    this.userManagement = new UserManagementController(this.auth0);
    this.userApi = new UserManagementApi(
      new CreateUserApi(
        this.userManagement));
    this.prefix = prefix;
  }

  public mountApi(): Koa.Middleware {
    this.use(bodyParser());
    this.use(this.userApi.getRoutes());
    return mount(this.prefix || '/', this);
  }
}
