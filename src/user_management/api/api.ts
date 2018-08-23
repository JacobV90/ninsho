/* tslint:disable:max-line-length*/

import * as Router from 'koa-router';
import { UserManagementController } from '../controller/controller';
import { User, UserData } from 'auth0';
import { Middleware, Context } from 'koa';

export interface IBeforeCreateUserResults{
  attachToUser?: boolean;
  propsToAdd?: string[];
  [propName: string]: any;
}

export class UserManagementApi {

  private router: Router;
  private controller: UserManagementController;
  private beforeCreateNewUser: (ctx: Context, next: () => Promise<any>) => Promise<IBeforeCreateUserResults> = null;
  private afterCreateNewUser: (ctx: Context, next: () => Promise<any>) => Promise<void> = null;

  constructor(controller: UserManagementController) {
    this.router = new Router();
    this.controller = controller;
    this.router.post(
      '/',
      (ctx: Context, next: () => Promise<any>) => this.createNewUser(ctx, next));
  }

  public getRoutes(): Middleware {
    return this.router.routes();
  }

  public beforeCreateNewUserHook(fn: (ctx: Context, next: () => Promise<any>) => Promise<object>) {
    this.beforeCreateNewUser = fn;
  }

  public afterCreateNewUserHook(fn: (ctx: Context, next: () => Promise<any>) => Promise<void>) {
    this.afterCreateNewUser = fn;
  }

  private async createNewUser(ctx: Context, next: () => Promise<any>) {
    if (Object.keys(ctx.request.body).length < 1) {
      ctx.throw(400, 'request body is empty');
    }
    let beforeResults: IBeforeCreateUserResults = {};
    let user: User = {};

    if (this.beforeCreateNewUser) {
      beforeResults = await this.beforeCreateNewUser(ctx, next);
      (ctx.state as any)['beforeResults'] = beforeResults;
    }

    const requestParams: any = ctx.request.body;
    requestParams['user_metadata'] = {};

    if (beforeResults.attachToUser) {
      for (const property in beforeResults) {
        if (!beforeResults.propsToAdd || beforeResults.propsToAdd.includes(property + '')) {
          (requestParams.user_metadata as any)[property + ''] = (beforeResults as any)[property + ''];
        }
      }
    }
    const userData: UserData = requestParams as UserData;

    try {
      user = await this.controller.createUser(userData);
    } catch (error) {
      ctx.throw(error.statusCode, error);
    }

    if (this.afterCreateNewUser) {
      (ctx.state as any)['user'] = user;
      await this.afterCreateNewUser(ctx, next);
    } else {
      ctx.body = user;
    }
  }
}
