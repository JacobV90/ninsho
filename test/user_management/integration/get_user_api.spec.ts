/* tslint:disable:max-line-length*/
/* tslint:disable:ter-prefer-arrow-callback*/

import 'mocha';
import { expect } from 'chai';
import * as request from 'supertest';
import * as Koa from 'koa';
import { Ninsho } from '../../../src/ninsho';
import { User } from 'auth0';
import { randomEmail, randomPassword, AuthConnections } from '../../helpers/';
const config = require('../../../config.json').auth0;

describe('get_user_api.spec.ts', function () {
  this.timeout(5000);

  describe('Get User Api', function () {

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

    it('should get a user provided a valid user id', async function () {
      const user: User = await ninsho.userManagement.createUser({
        email: userOneEmail,
        password: randomPassword(),
        connection: AuthConnections.defaultConnection,
      });
      const response = await request(server).get('/users/' + user.user_id);
      expect(response.status).to.equal(200);
      expect(response.body.email).to.equal(userOneEmail);
      if (user.user_id) {
        await ninsho.userManagement.deleteUser({ id: user.user_id });
      }
    });

    it('should NOT get a user provided an invalid user id', function (done) {
      request(server)
      .get('/users/willnotwork')
      .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.text).to.equal('Object didn\'t pass validation for format user-id: willnotwork');
        done();
      });
    });

  });
});
