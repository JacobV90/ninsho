/* tslint:disable:max-line-length*/

import { UserManagementController } from '../index';
import { DeleteUserData } from '../../common/types';
import { Context } from 'koa';
import { HttpAction, RestApiEndpoint } from '../../common/rest_api_endpoint';

/**
 * The DeleteUserApi class provides the functionality behind the delete user api.
 * It can be used to set before and after hooks as well as a custom error handler.
 *
 * Returned data from the before hook function will be attached to the context state.
 */
export class DeleteUserApi extends RestApiEndpoint{

  private controller: UserManagementController;

  constructor(controller: UserManagementController) {
    super('/users/:id', HttpAction.DEL);
    this.controller = controller;
  }

  public async invoke(ctx: Context, next: () => Promise<any>): Promise<void> {
    await this.handleBeforeHook(ctx);

    const userData: DeleteUserData = ctx.params as DeleteUserData;

    try {
      await this.controller.deleteUser(userData);
    } catch (error) {
      await this.handleError(ctx, error);
    }

    await this.handleResponse(ctx);
  }
}
