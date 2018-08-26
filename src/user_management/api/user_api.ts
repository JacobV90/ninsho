/* tslint:disable:max-line-length*/

import * as Router from 'koa-router';
import { Middleware, Context } from 'koa';
import { CreateUserApi } from './create_user_api';

/**
 * The UserManagementApi class creates all of the routes associated with user management.
 * Use this class if you only want to mount the user management routes
 */
export class UserManagementApi {

  public createUser: CreateUserApi;
  private router: Router;

  constructor(createUserApi: CreateUserApi) {
    this.router = new Router();
    this.createUser = createUserApi;
    this.router.post(
      '/users',
      (ctx: Context, next: () => Promise<any>) => createUserApi.invoke(ctx, next));
  }

  /**
   * returns middleware that exposes the user management api service
   */
  public getRoutes(): Middleware {
    return this.router.routes();
  }
}
