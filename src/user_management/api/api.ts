import * as Router from 'koa-router';
import { UserManagementController } from '../controller/controller';
import { UserData } from 'auth0';
import { Middleware, Context } from 'koa';

export class UserManagementApi {

  private router: Router;
  private controller: UserManagementController;

  constructor(controller: UserManagementController) {
    this.router = new Router();
    this.controller = controller;
    this.router.post('/', (ctx: Router.IRouterContext) => this.signupNewUser(ctx));
  }

  public getRoutes(): Middleware {
    return this.router.routes();
  }

  private async signupNewUser(ctx: Context) {
    const userData: UserData = {
      email: (ctx.request.body as any).email,
      password: (ctx.request.body as any).password,
    };
    try {
      ctx.body = await this.controller.createUser(userData);
      ctx.status = 201;
    } catch (error) {
      ctx.throw(400, error);
    }
  }
}
