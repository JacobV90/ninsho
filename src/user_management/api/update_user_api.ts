/* tslint:disable:max-line-length*/

import { UserManagementController } from '../index';
import { User, UserData } from 'auth0';
import { Context } from 'koa';
import { AddDataToRequestApi } from '../../common/rest_api_endpoint';
import { ObjectWithAny } from '../../common/types';
import { mergeObject } from '../../common/utils';

/**
 * The CreateUserApi class provides the functionality behind the create user api.
 * It can be used to set before and after hooks as well as a custom error handler.
 */
export class UpdateUserApi extends AddDataToRequestApi{

  private controller: UserManagementController;

  constructor(controller: UserManagementController) {
    super();
    this.controller = controller;
  }

  public async invoke(ctx: Context, next: () => Promise<any>): Promise<void> {
    AddDataToRequestApi.validateBody(ctx);
    await this.handleBeforeHook(ctx);

    const userData: UserData = {};
    mergeObject(userData, ctx.request.body as ObjectWithAny, ['email', 'user_metadata', 'username']);
    const userId: string = ctx.params.id;
    let user: User = {};

    try {
      user = await this.controller.updateUser(userId, userData);
    } catch (error) {
      await this.handleError(ctx, error);
    }

    await this.handleResponse(ctx, user);
  }
}
