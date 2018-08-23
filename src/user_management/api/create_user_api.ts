/* tslint:disable:max-line-length*/

import { UserManagementController } from '../';
import { User, UserData } from 'auth0';
import { Context } from 'koa';
import { HttpError } from 'http-errors';
import { Api } from '../../common/api';

export interface IBeforeHookData{
  attachToUser?: boolean;
  propsToAdd?: string[];
  [propName: string]: any;
}

export class CreateUserApi extends Api{

  public beforeHook: (ctx: Context, next: () => Promise<any>) => Promise<IBeforeHookData> = null;
  public afterHook: (ctx: Context, next: () => Promise<any>) => Promise<void> = null;
  public errorHandler: (ctx: Context, error: HttpError) => Promise<void> = null;

  private controller: UserManagementController;

  constructor(controller: UserManagementController) {
    super();
    this.controller = controller;
  }

  public async invoke(ctx: Context, next: () => Promise<any>): Promise<void> {
    this.validateBody(ctx);

    let beforeHookData: IBeforeHookData = {};
    let user: User = {};

    if (this.beforeHook) {
      beforeHookData = await this.beforeHook(ctx, next);
      (ctx.state as any)['beforeHookData'] = beforeHookData;
    }

    const requestParams: any = ctx.request.body;
    requestParams['user_metadata'] = {};

    if (beforeHookData.attachToUser) {
      for (const property in beforeHookData) {
        if (!beforeHookData.propsToAdd || beforeHookData.propsToAdd.includes(property + '')) {
          (requestParams.user_metadata as any)[property + ''] = (beforeHookData as any)[property + ''];
        }
      }
    }
    const userData: UserData = requestParams as UserData;

    try {
      user = await this.controller.createUser(userData);
    } catch (error) {
      return await this.errorHandler ?
        this.errorHandler(ctx, error) :
        ctx.throw(error.statusCode, error);
    }

    if (this.afterHook) {
      (ctx.state as any)['user'] = user;
      return await this.afterHook(ctx, next);
    }
    ctx.body = user;
  }
}
