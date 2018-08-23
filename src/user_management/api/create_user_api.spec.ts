/* tslint:disable:max-line-length*/

import 'mocha';
import { expect } from 'chai';
import * as request from 'supertest';
import * as Koa from 'koa';
import { userAuthApp, userController, userApi } from '../../app';
import { IBeforeHookData } from './create_user_api';
import { HttpError } from 'http-errors';

describe('create_user_api.spec.ts', () => {
  describe('Create User Api', () => {

    let app: Koa;
    let server: any;
    const userOneEmail: string = 'jvtalon906@yahoo.com';

    before(() => {
      app = new Koa();
      app.use(userAuthApp);
      server = app.listen(3000);
    });

    after(async () => {
      await server.close();
    });

    it('should create a new user provided valid parameters', async () => {
      let userId: string = '';
      await request(server)
      .post('/users')
      .send({
        email: userOneEmail,
        password: 'testPassword123',
      })
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.email).to.equal(userOneEmail);
        expect(response.body.user_id).to.not.be.undefined;
        userId = response.body.user_id;
      });
      await userController.deleteUser({ id: userId });
    });

    it('should NOT create a new user provided an invalid email', async () => {
      const invalidEmail: string = 'notvalid';
      await request(server)
      .post('/users')
      .send({
        email: invalidEmail,
        password: 'testPassword123',
      })
      .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.text).to.equal('Payload validation error: \'Object didn\'t pass validation for format email: ' +
          invalidEmail + '\' on property email (The user\'s email).');
        expect(response.body.email).to.be.undefined;
        expect(response.body.user_id).to.be.undefined;
      });
    });

    it('should NOT create a new user provided a password that does not meet strength requirements', async () => {
      await request(server)
      .post('/users')
      .send({
        email: userOneEmail,
        password: 'test',
      })
      .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.text).to.equal('PasswordStrengthError: Password is too weak');
        expect(response.body.email).to.be.undefined;
        expect(response.body.user_id).to.be.undefined;
      });
    });
  });

  describe('Create User Api w/Hooks', () => {

    let app: Koa;
    let server: any;
    const userOneEmail: string = 'jvtalon906@yahoo.com';

    it('should create a new user provided valid parameters and attach all properties from the "beforeResult" object ', async () => {
      // setup
      const beforeHook = async (): Promise<IBeforeHookData> => {
        return {
          attachToUser: true,
          test: 'test',
        };
      };

      const afterHook = async (ctx: Koa.Context): Promise<void> => {
        ctx.body = ctx.state.user;
      };

      app = new Koa();
      userApi.createUser.beforeHook = beforeHook;
      userApi.createUser.afterHook = afterHook;
      app.use(userAuthApp);

      server = app.listen(3000);
      // end setup

      let userId: string = '';
      await request(server)
      .post('/users')
      .send({
        email: userOneEmail,
        password: 'testPassword123',
      })
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.email).to.equal(userOneEmail);
        expect(response.body.user_id).to.not.be.undefined;
        expect(response.body.user_metadata.test).to.equal('test');
        userId = response.body.user_id;
      });
      await userController.deleteUser({ id: userId });

      await server.close();
    });

    it('should create a new user provided valid parameters and attach some properties from the "beforeResult" object', async () => {
      // setup
      const beforeHook = async (): Promise<IBeforeHookData> => {
        return {
          attachToUser: true,
          propsToAdd: ['address', 'married', 'mothersMaidenName', 'friends', 'age'],
          age: 27,
          address: {
            state: 'Iowa',
            street: 'random',
            zip: '52246',
          },
          married: false,
          mothersMaidenName: 'Smith',
          friends: ['Jeremy', 'Chelsea', 'Alyssa', 'Max'],
          access: {
            token: 'test token',
            expiration: 4800,
          },
        };
      };

      const afterHook = async (ctx: Koa.Context): Promise<void> => {
        expect(ctx.state.beforeHookData.access.token).to.equal('test token');
        expect(ctx.state.beforeHookData.access.expiration).to.equal(4800);
        ctx.body = ctx.state.user;
      };

      app = new Koa();
      userApi.createUser.beforeHook = beforeHook;
      userApi.createUser.afterHook = afterHook;
      app.use(userAuthApp);

      server = app.listen(3000);
      // end setup

      let userId: string = '';
      await request(server)
      .post('/users')
      .send({
        email: userOneEmail,
        password: 'testPassword123',
      })
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.email).to.equal(userOneEmail);
        expect(response.body.user_id).to.not.be.undefined;
        expect(response.body.user_metadata.address.street).to.equal('random');
        expect(response.body.user_metadata.address.state).to.equal('Iowa');
        expect(response.body.user_metadata.address.zip).to.equal('52246');
        expect(response.body.user_metadata.age).to.equal(27);
        expect(response.body.user_metadata.married).to.equal(false);
        expect(response.body.user_metadata.mothersMaidenName).to.equal('Smith');
        expect(response.body.user_metadata.friends[0]).to.equal('Jeremy');
        expect(response.body.user_metadata.friends.length).to.equal(4);
        expect(response.body.user_metadata.access).to.be.undefined;

        userId = response.body.user_id;
      });
      await userController.deleteUser({ id: userId });

      await server.close();
    });

    it('should create a new user provided valid parameters and not attach any properties from the "beforeResult" object ', async () => {
      // setup
      const beforeHook = async (): Promise<IBeforeHookData> => {
        return {
          token: 'test token',
        };
      };

      const afterHook = async (ctx: Koa.Context): Promise<void> => {
        expect(ctx.state.beforeHookData.token).to.equal('test token');
        ctx.body = ctx.state.user;
      };

      app = new Koa();
      userApi.createUser.beforeHook = beforeHook;
      userApi.createUser.afterHook = afterHook;
      app.use(userAuthApp);

      server = app.listen(3000);
      // end setup

      let userId: string = '';
      await request(server)
      .post('/users')
      .send({
        email: userOneEmail,
        password: 'testPassword123',
      })
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.email).to.equal(userOneEmail);
        expect(response.body.user_id).to.not.be.undefined;
        expect(response.body.user_metadata.token).to.be.undefined;
        userId = response.body.user_id;
      });
      await userController.deleteUser({ id: userId });

      await server.close();
    });
  });

  describe('Create User Api w/Custom Error Handler', () => {

    it('should NOT create a new user provided an invalid email and response with a custom error message', async () => {
      // setup
      const errorHandler = async (ctx: Koa.Context, error: HttpError): Promise<void> => {
        error.message = 'email is not in a valid format';
        ctx.throw(error.statusCode, error);
      };
      const email: string = 'not valid';
      const password: string = 'testPassword123';

      const app: Koa = new Koa();
      userApi.createUser.errorHandler = errorHandler;
      app.use(userAuthApp);

      const server = app.listen(3000);
      // end setup

      await request(server)
      .post('/users')
      .send({
        email,
        password,
      })
      .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.text).to.equal('email is not in a valid format');
        expect(response.body.email).to.be.undefined;
        expect(response.body.user_id).to.be.undefined;
      });
      await server.close();
    });

  });
});
