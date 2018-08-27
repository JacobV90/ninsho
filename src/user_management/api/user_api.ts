/* tslint:disable:max-line-length*/

import * as Router from 'koa-router';
import { Middleware, Context } from 'koa';
import {
  CreateUserApi,
  DeleteUserApi,
  GetUserApi,
} from './';

/**
 * The UserManagementApi class creates all of the routes associated with user management.
 * Use this class if you only want to mount the user management routes
 */
export class UserManagementApi {

  public createUser: CreateUserApi;
  public deleteUser: DeleteUserApi;
  public getUser: GetUserApi;

  private router: Router;

  constructor(createUserApi: CreateUserApi,
              deleteUserApi: DeleteUserApi,
              getUserApi: GetUserApi,
  ) {
    this.router = new Router();
    this.createUser = createUserApi;
    this.deleteUser = deleteUserApi;
    this.getUser = getUserApi;

    this.router.post(
      '/users',
      (ctx: Context, next: () => Promise<any>) => createUserApi.invoke(ctx, next));

    this.router.del(
      '/users/:id',
      (ctx: Context, next: () => Promise<any>) => deleteUserApi.invoke(ctx, next));

    this.router.get(
      '/users/:id',
      (ctx: Context, next: () => Promise<any>) => getUserApi.invoke(ctx, next));

  }

  /**
   * returns middleware that exposes the user management api service
   */
  public getRoutes(): Middleware {
    return this.router.routes();
  }
}
