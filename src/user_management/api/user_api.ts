/* tslint:disable:max-line-length*/

import * as Router from 'koa-router';
import { Middleware, Context } from 'koa';
import { CreateUserApi } from './create_user_api';

export class UserManagementApi {

  public createUser: CreateUserApi;
  private router: Router;

  constructor(createUserApi: CreateUserApi) {
    this.router = new Router();
    this.createUser = createUserApi;
    this.router.post(
      '/',
      (ctx: Context, next: () => Promise<any>) => createUserApi.invoke(ctx, next));
  }

  public getRoutes(): Middleware {
    return this.router.routes();
  }
}
