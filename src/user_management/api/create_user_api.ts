/* tslint:disable:max-line-length*/

import { UserManagementController } from '../';
import { User, UserData } from 'auth0';
import { Context } from 'koa';
import { RestApiEndpoint } from '../../common/rest_api_endpoint';

export interface ICreateUserBeforeHookData {
  attachToUser?: boolean;
  propsToAdd?: string[];
  [propName: string]: any;
}

export class CreateUserApi extends RestApiEndpoint{

  public beforeHook: (ctx: Context) => Promise<ICreateUserBeforeHookData> = null;
  private controller: UserManagementController;

  constructor(controller: UserManagementController) {
    super();
    this.controller = controller;
  }

  public async invoke(ctx: Context, next: () => Promise<any>): Promise<void> {
    RestApiEndpoint.validateBody(ctx);
    await this.handleBeforeHook(ctx);

    const userData: UserData = ctx.request.body as UserData;
    let user: User = {};

    try {
      user = await this.controller.createUser(userData);
    } catch (error) {
      await this.handleError(ctx, error);
    }

    await this.handleResponse(ctx, user);
  }

  protected async handleBeforeHook(ctx: Context): Promise<void> {
    if (this.beforeHook) {
      const beforeHookData: ICreateUserBeforeHookData = await this.beforeHook(ctx);
      (ctx.state as any)['beforeHookData'] = beforeHookData;

      if (beforeHookData.attachToUser) {
        const requestBody: any = ctx.request.body;
        requestBody['user_metadata'] = {};

        for (const property in beforeHookData) {
          if (!beforeHookData.propsToAdd || beforeHookData.propsToAdd.includes(property + '')) {
            (requestBody.user_metadata as any)[property + ''] = (beforeHookData as any)[property + ''];
          }
        }
        (ctx.request.body as any)['user_metadata'] = requestBody.user_metadata;
      }
    }
  }
}
