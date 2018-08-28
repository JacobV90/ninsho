/* tslint:disable:max-line-length*/

import * as Router from 'koa-router';
import { Middleware } from 'koa';
import { RestApiEndpoint } from '../../common/rest_api_endpoint';

/**
 * The UserManagementApi class creates all of the routes associated with user management.
 * Use this class if you only want to mount the user management routes
 */
export class UserManagementApi {

  public createUser: RestApiEndpoint;
  public deleteUser: RestApiEndpoint;
  public getUser: RestApiEndpoint;
  public updateUser: RestApiEndpoint;

  private router: Router;

  constructor(createUserApi: RestApiEndpoint,
              deleteUserApi: RestApiEndpoint,
              getUserApi: RestApiEndpoint,
              updateUserApi: RestApiEndpoint,
  ) {
    this.router = new Router();
    this.createUser = createUserApi;
    this.deleteUser = deleteUserApi;
    this.getUser = getUserApi;
    this.updateUser = updateUserApi;

    this.router.use(this.createUser.getRouter());
    this.router.use(this.deleteUser.getRouter());
    this.router.use(this.getUser.getRouter());
    this.router.use(this.updateUser.getRouter());
  }

  /**
   * returns middleware that exposes the user management api service
   */
  public getRoutes(): Middleware {
    return this.router.routes();
  }
}
