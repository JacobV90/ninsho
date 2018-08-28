/* tslint:disable:max-line-length*/

import { UserManagementController } from '../index';
import { CreateUserData, User } from 'auth0';
import { Context } from 'koa';
import { AddDataToRequestApi, HttpAction } from '../../common/rest_api_endpoint';

/**
 * The CreateUserApi class provides the functionality behind the create user api.
 * It can be used to set before and after hooks as well as a custom error handler.
 */
export class CreateUserApi extends AddDataToRequestApi{

  private controller: UserManagementController;

  constructor(controller: UserManagementController) {
    super('/users', HttpAction.POST);
    this.controller = controller;
  }

  protected async invoke(ctx: Context, next: () => Promise<any>): Promise<void> {
    AddDataToRequestApi.validateBody(ctx);
    await this.handleBeforeHook(ctx);

    let user: User = {};
    try {
      user = await this.controller.createUser(ctx.request.body as CreateUserData);
    } catch (error) {
      await this.handleError(ctx, error);
    }

    await this.handleResponse(ctx, user);
  }
}
