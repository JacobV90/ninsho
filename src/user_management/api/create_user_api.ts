/* tslint:disable:max-line-length*/

import { UserManagementController } from '../index';
import { User, UserData } from 'auth0';
import { Context } from 'koa';
import { RestApiEndpoint } from '../../common/rest_api_endpoint';
import { ObjectWithAny } from '../../common/types';
import { mergeObject } from '../../common/utils';

/**
 * If a before hook function is specified for the create user api, the function must
 * return an object of this type.
 */
export interface CreateUserBeforeHookData{
  /**
   * If true, data returned by the before hook will be attached to the
   * "user_metadata" property before creating a new user
   */
  attachToUser?: boolean;

  /**
   * If specified, only these fields will be added to the 'user_metadata' field
   */
  propsToAdd?: string[];

  /**
   * Allows any number of properties of any type
   */
  data: ObjectWithAny | undefined;
}

/**
 * The CreateUserApi class provides the functionality behind the create user api.
 * It can be used to set before and after hooks as well as a custom error handler.
 */
export class CreateUserApi extends RestApiEndpoint{

  public beforeHook?: (ctx: Context) => Promise<CreateUserBeforeHookData>;
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
      const beforeHookData: CreateUserBeforeHookData = await this.beforeHook(ctx);
      (ctx.state as ObjectWithAny)['beforeHookData'] = beforeHookData;
      if (beforeHookData.attachToUser && beforeHookData.data) {
        if (!(ctx.request.body as ObjectWithAny)['user_metadata']) {
          (ctx.request.body as ObjectWithAny)['user_metadata'] = {};
        }
        mergeObject((ctx.request.body as ObjectWithAny)['user_metadata'], beforeHookData.data, beforeHookData.propsToAdd);
      }
    }
  }
}
