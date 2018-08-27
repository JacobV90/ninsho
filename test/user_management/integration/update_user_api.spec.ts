/* tslint:disable:max-line-length*/
/* tslint:disable:ter-prefer-arrow-callback*/

import 'mocha';
import { expect } from 'chai';
import * as request from 'supertest';
import * as Koa from 'koa';
import { Ninsho } from '../../../src/ninsho';
import { CreateUserData, UpdateUserData, User } from 'auth0';
import { randomEmail, randomPassword, AuthConnections, randomString } from '../../helpers/';
import { ObjectWithAny } from '../../../src/common/types';
const config = require('../../../config.json').auth0;

describe('update_user_api.spec.ts', function () {
  this.timeout(5000);

  describe('Update User Api', function () {

    let app: Koa;
    let ninsho: Ninsho;
    let server: any;
    let user: User;
    const userOneEmail: string = randomEmail();

    before(async () => {
      app = new Koa();
      ninsho = new Ninsho(config);
      user = await ninsho.userManagement.createUser({
        email: userOneEmail,
        password: randomPassword(),
        connection: AuthConnections.defaultConnection,
      });
      app.use(ninsho.mountApi());
      server = app.listen(3000);
    });

    after(async () => {
      await server.close();
    });

    it('should update a users email and user metadata attributes', async function () {
      const updateUserData: UpdateUserData = {
        email: randomEmail(),
        user_metadata: {
          test: 'test',
        },
      };
      const response = await request(server)
        .patch('/users/' + user.user_id)
        .send(updateUserData);
      expect(response.status).to.equal(200);
      expect(response.body.email).to.equal(updateUserData.email);
      expect(response.body.user_metadata.test).to.equal((updateUserData.user_metadata as ObjectWithAny).test);

      if (user.user_id) {
        await ninsho.userManagement.deleteUser({ id: user.user_id });
      }
    });

    it('should update a users username attribute', async function () {
      // setup
      const user: User = await ninsho.userManagement.createUser({
        email: randomEmail(),
        password: randomPassword(),
        username: randomString({ length: 10, pool: 'asdfhkjladsf' }),
        connection: AuthConnections.userNameConnection,
      });

      const updateUserData: UpdateUserData = {
        username: 'onetimer',
        connection: AuthConnections.userNameConnection,
      };
      const response = await request(server)
      .patch('/users/' + user.user_id)
      .send(updateUserData);
      expect(response.status).to.equal(200);
      expect(response.body.username).to.equal(updateUserData.username);

      if (user.user_id) {
        await ninsho.userManagement.deleteUser({ id: user.user_id });
      }
    });

    it('should not update a users username attribute that does not meet requirements', async function () {
      const user: User = await ninsho.userManagement.createUser({
        email: randomEmail(),
        password: randomPassword(),
        username: randomString({ length: 10, pool: 'asdfhkjladsf' }),
        connection: AuthConnections.userNameConnection,
      });

      const updateUserData: UpdateUserData = {
        username: '',
        connection: AuthConnections.userNameConnection,
      };
      const response = await request(server)
      .patch('/users/' + user.user_id)
      .send(updateUserData);
      expect(response.status).to.equal(400);
      expect(response.text).to.equal('Payload validation error: \'String is too short (0 chars), minimum 1\' on' +
        ' property username (The user\'s username. Only valid if the connection requires a username).');

      if (user.user_id) {
        await ninsho.userManagement.deleteUser({ id: user.user_id });
      }
    });
  });
});
