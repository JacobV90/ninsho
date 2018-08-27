import { Context } from 'koa';
import { HttpError } from 'http-errors';
import { mergeObject } from './utils';
import { ObjectWithAny, AddBeforeHookDataToUser } from './types';

/**
 * The RestApiEndpoint class utilizes the Koa framework to handle all
 * requests, responses, and errors. All of the Ninsho rest api endpoints inherit from this class.
 *
 * Koa context details:
 * https://koajs.com/#context
 */
export abstract class RestApiEndpoint {

  /**
   * A before hook function can be set that will run before performing the requested
   * auth0 operation. Data returned by this function will be added to the context state.
   * e.g. (ctx.state.beforeHookData)
   */
  public beforeHook?: (ctx: Context) => Promise<any>;

  /**
   * An after hook function can be set that will run after performing the requested auth0 operation.
   * Data returned by the before hook can be accessed here. If specified, the after hook function
   * must handle responses back to the client.
   */
  public afterHook?: (ctx: Context) => Promise<void>;

  /**
   * An error handler function can be set that will run if the requested auth0 operation failed.
   * If specified, the function must handle the error response back to the client.
   */
  public errorHandler?: (ctx: Context, error: HttpError) => Promise<void>;

  public static validateBody(ctx: Context): void {
    if (!ctx.request.body || Object.keys(ctx.request.body).length < 1) {
      ctx.throw(400, 'request body is empty');
    }
  }

  protected async handleBeforeHook(ctx: Context): Promise<void> {
    if (this.beforeHook) {
      (ctx.state as any)['beforeHookData'] = await this.beforeHook(ctx);
    }
  }

  protected async handleError(ctx: Context, error: HttpError): Promise<void> {
    if (this.errorHandler) {
      return await this.errorHandler(ctx, error);
    }
    ctx.throw(error.statusCode, error);
  }

  protected async handleResponse(ctx: Context, data?: any): Promise<void> {
    if (this.afterHook) {
      if (data) {
        (ctx.state as any)['data'] = data;
      }
      return await this.afterHook(ctx);
    }
    ctx.body = data;
  }

  public abstract invoke(ctx: Context, next: () => Promise<any>): Promise<void>;
}

export abstract class AddDataToRequestApi extends RestApiEndpoint {
  public beforeHook?: (ctx: Context) => Promise<AddBeforeHookDataToUser>;

  protected async handleBeforeHook(ctx: Context): Promise<void> {
    if (this.beforeHook) {
      const beforeHookData: AddBeforeHookDataToUser = await this.beforeHook(ctx);
      (ctx.state as ObjectWithAny)['beforeHookData'] = beforeHookData;
      if (beforeHookData.attachToUser && beforeHookData.data) {
        if (!(ctx.request.body as ObjectWithAny)['user_metadata']) {
          (ctx.request.body as ObjectWithAny)['user_metadata'] = {};
        }
        mergeObject(
          (ctx.request.body as ObjectWithAny)['user_metadata'],
          beforeHookData.data,
          beforeHookData.propsToAdd);
      }
    }
  }
}
