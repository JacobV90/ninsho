/* tslint:disable:max-line-length*/
/* tslint:disable:ter-prefer-arrow-callback*/

import 'mocha';
import { expect } from 'chai';
import * as request from 'supertest';
import * as Koa from 'koa';
import { Ninsho } from '../../../src/ninsho';
import * as sinon from 'sinon';
import { User } from 'auth0';
import { ObjectWithAny } from '../../../src/common/types';
import { randomEmail, randomPassword } from '../../helpers/random_generator';

const config = require('../../../config.json').auth0;

describe('delete_user_api.spec.ts', function () {
  this.timeout(5000);

  describe('Delete User Api', function () {

    let app: Koa;
    let ninsho: Ninsho;
    let server: any;
    const userOneEmail: string = randomEmail();

    before(async () => {
      app = new Koa();
      ninsho = new Ninsho(config);
      app.use(ninsho.mountApi());
      server = app.listen(3000);
    });

    after(async () => {
      await server.close();
    });

    it('should delete a user provided a valid user id', async function () {
      const user: User =  await ninsho.userManagement.createUser({
        email: userOneEmail,
        password: randomPassword(),
      });
      const response = await request(server).del('/users/' + user.user_id);
      expect(response.status).to.equal(204);
      expect(response.body.user_id).to.be.undefined;
    });

    it('should NOT delete a user provided an invalid user id', function (done) {
      request(server)
      .del('/users/willnotwork')
      .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.text).to.equal('Object didn\'t pass validation for format user-id: willnotwork');
        done();
      });
    });

    it('should NOT delete a user provided no user id', function (done) {
      request(server)
      .del('/users/')
      .then((response) => {
        expect(response.status).to.equal(404);
        expect(response.text).to.equal('Not Found');
        done();
      });
    });
  });

  describe('Delete User Api w/Hooks', () => {

    let app: Koa;
    let ninsho: Ninsho;
    let server: any;
    const userOneEmail: string = randomEmail();

    it('should delete a user provided valid parameters and attach data to context state', async function () {
      // setup
      const beforeHookData: ObjectWithAny = {
        data: {
          test: 'test',
        },
      };

      const beforeHook = async (): Promise<ObjectWithAny> => {
        return beforeHookData;
      };

      const afterHook = async (ctx: Koa.Context): Promise<void> => {
        expect(ctx.state.beforeHookData.data.test).to.equal('test');
        ctx.body = ctx.state.data;
      };

      const beforeHookSpy: sinon.SinonSpy = sinon.spy(beforeHook);

      app = new Koa();
      ninsho = new Ninsho(config);
      ninsho.userApi.deleteUser.beforeHook = beforeHookSpy;
      ninsho.userApi.deleteUser.afterHook = afterHook;
      app.use(ninsho.mountApi());

      server = app.listen(3000);

      const user: User =  await ninsho.userManagement.createUser({
        email: userOneEmail,
        password: randomPassword(),
      });
      // end setup

      const response = await request(server).del('/users/' + user.user_id);
      expect(beforeHookSpy.returned(Promise.resolve(beforeHookData))).to.be.true;
      expect(response.status).to.equal(204);

      await server.close();
    });
  });
});
