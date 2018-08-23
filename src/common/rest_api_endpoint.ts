import { Context } from 'koa';
import { HttpError } from 'http-errors';

export abstract class RestApiEndpoint {

  public beforeHook: (ctx: Context) => Promise<any> = null;
  public afterHook: (ctx: Context) => Promise<void> = null;
  public errorHandler: (ctx: Context, error: HttpError) => Promise<void> = null;

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
    return await this.errorHandler ?
      this.errorHandler(ctx, error) :
      ctx.throw(error.statusCode, error);
  }

  protected async handleResponse(ctx: Context, data: any): Promise<void> {
    if (this.afterHook) {
      (ctx.state as any)['data'] = data;
      return await this.afterHook(ctx);
    }
    ctx.body = data;
  }

  public abstract invoke(ctx: Context, next: () => Promise<any>): Promise<void>;
}
