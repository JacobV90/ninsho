/* tslint:disable:max-line-length*/

import { UserManagementController } from '../index';
import { Context } from 'koa';
import { RestApiEndpoint } from '../../common/rest_api_endpoint';
import { User } from 'auth0';

/**
 * The GetUserApi class provides the functionality behind the get user api.
 * It can be used to set before and after hooks as well as a custom error handler.
 *
 * Returned data from the before hook function will be attached to the context state.
 */
export class GetUserApi extends RestApiEndpoint{

  private controller: UserManagementController;

  constructor(controller: UserManagementController) {
    super();
    this.controller = controller;
  }

  public async invoke(ctx: Context, next: () => Promise<any>): Promise<void> {
    await this.handleBeforeHook(ctx);
    let user: User = {};
    try {
      user = await this.controller.getUser({ id: ctx.params.id });
    } catch (error) {
      await this.handleError(ctx, error);
    }
    await this.handleResponse(ctx, user);
  }
}
