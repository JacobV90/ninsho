import { Context, Middleware } from 'koa';
import { HttpError } from 'http-errors';
import { mergeObject } from './utils';
import { ObjectWithAny, AddBeforeHookDataToUser } from './types';
import * as Router from 'koa-router';

export enum HttpAction {
  GET,
  PATCH,
  POST,
  DEL,
}

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
  public beforeInvoke?: (ctx: Context) => Promise<any>;

  /**
   * An after hook function can be set that will run after performing the requested auth0 operation.
   * Data returned by the before hook can be accessed here. If specified, the after hook function
   * must handle responses back to the client.
   */
  public afterInvoke?: (ctx: Context) => Promise<void>;

  /**
   * An error handler function can be set that will run if the requested auth0 operation failed.
   * If specified, the function must handle the error response back to the client.
   */
  public errorHandler?: (ctx: Context, error: HttpError) => Promise<void>;

  protected router: Router;

  public static validateBody(ctx: Context): void {
    if (!ctx.request.body || Object.keys(ctx.request.body).length < 1) {
      ctx.throw(400, 'request body is empty');
    }
  }

  constructor(route: string, action: HttpAction) {
    this.router = new Router();
    this.configureRouter(route, action);
  }

  protected abstract invoke(ctx: Context, next: () => Promise<any>): Promise<void>;

  public getRouter(): Middleware {
    return this.router.routes();
  }

  protected async handleBeforeHook(ctx: Context): Promise<void> {
    if (this.beforeInvoke) {
      (ctx.state as any)['beforeHookData'] = await this.beforeInvoke(ctx);
    }
  }

  protected async handleError(ctx: Context, error: HttpError): Promise<void> {
    if (this.errorHandler) {
      return await this.errorHandler(ctx, error);
    }
    ctx.throw(error.statusCode, error);
  }

  protected async handleResponse(ctx: Context, data?: any): Promise<void> {
    if (this.afterInvoke) {
      if (data) {
        (ctx.state as any)['data'] = data;
      }
      return await this.afterInvoke(ctx);
    }
    ctx.body = data;
  }

  private configureRouter(route: string, action: HttpAction) {
    switch (action) {
      case HttpAction.DEL:
        this.router.del(
          route,
          (ctx: Context, next: () => Promise<any>) => this.invoke(ctx, next));
        break;

      case HttpAction.GET:
        this.router.get(
          route,
          (ctx: Context, next: () => Promise<any>) => this.invoke(ctx, next));
        break;

      case HttpAction.POST:
        this.router.post(
          route,
          (ctx: Context, next: () => Promise<any>) => this.invoke(ctx, next));
        break;

      case HttpAction.PATCH:
        this.router.patch(
          route,
          (ctx: Context, next: () => Promise<any>) => this.invoke(ctx, next));
        break;
    }
  }
}

export abstract class AddDataToRequestApi extends RestApiEndpoint {
  public beforeInvoke?: (ctx: Context) => Promise<AddBeforeHookDataToUser>;

  protected async handleBeforeHook(ctx: Context): Promise<void> {
    if (this.beforeInvoke) {
      const beforeHookData: AddBeforeHookDataToUser = await this.beforeInvoke(ctx);
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
