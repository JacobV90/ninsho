import * as Koa from 'koa';
import * as mount from 'koa-mount';
import {
  UserManagementApi,
  UserManagementController,
} from './user_management';
import * as bodyParser from 'koa-bodyparser';
import { Auth0, Auth0Config } from './common/auth0';
import { CreateUserApi } from './user_management/api/create_user_api';

/**
 * The Ninsho class is the entry point to access all of the other classes that can be
 * used throughout an application that it has been imported into.
 */
export class Ninsho extends Koa {
  public userApi: UserManagementApi;
  public auth0: Auth0;
  public userManagement: UserManagementController;
  private prefix: string;

  /**
   *
   * @param {Auth0Config} config - contains the required information from the Auth0 application
   * @param {string} prefix - the route prefix that the api service will mount to
   */
  constructor(config: Auth0Config, prefix?: string) {
    super();
    this.auth0 = new Auth0(config);
    this.userManagement = new UserManagementController(this.auth0);
    this.userApi = new UserManagementApi(
      new CreateUserApi(
        this.userManagement));
    this.prefix = prefix;
  }

  /**
   * returns middleware that exposes the rest api service
   */
  public mountApi(): Koa.Middleware {
    this.use(bodyParser());
    this.use(this.userApi.getRoutes());
    return mount(this.prefix || '/', this);
  }
}
