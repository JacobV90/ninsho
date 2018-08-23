import { Context } from 'koa';

export abstract class Api {

  public validateBody(ctx: Context): void {
    if (!ctx.request.body || Object.keys(ctx.request.body).length < 1) {
      ctx.throw(400, 'request body is empty');
    }
  }

  public validateQuery(ctx: Context): void {
    if (!ctx.request.query || Object.keys(ctx.request.query).length < 1) {
      ctx.throw(400, 'request query is empty');
    }
  }

  abstract invoke(ctx: Context, next: () => Promise<any>): Promise<void>;
}
