/* tslint:disable:max-line-length*/

import 'mocha';
import { expect } from 'chai';
import * as request from 'supertest';
import * as Koa from 'koa';
import { Auth0Config, UserManagementController } from '../controller/controller';
import { UserManagementApi } from './api';
import * as bodyParser from 'koa-bodyparser';
const config: Auth0Config = require('../../../config.json').auth0;

describe('Create User Api', () => {

  let app: Koa;
  let server: any;
  let controller: UserManagementController;
  let routes: Koa.Middleware;
  const userOneEmail: string = 'jvtalon906@yahoo.com';

  before(() => {
    app = new Koa();
    controller = new UserManagementController(config);
    routes = new UserManagementApi(controller).getRoutes();

    app.use(bodyParser());
    app.use(routes);
    server = app.listen(3000);
  });

  it('should create a new user provided valid parameters', async () => {
    let userId: string = '';
    await request(server)
      .post('/')
      .send({
        email: userOneEmail,
        password: 'testPassword123',
      })
      .then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.email).to.equal(userOneEmail);
        expect(response.body.user_id).to.not.be.undefined;
        userId = response.body.user_id;
      });
    await controller.deleteUser({ id: userId });
  });

  it('should NOT create a new user provided a missing parameter (email)', async () => {
    await request(server)
    .post('/')
    .send({
      password: 'testPassword123',
    })
    .then((response) => {
      expect(response.status).to.equal(400);
      expect(response.text).to.equal('\"email\" is required');
      expect(response.body.email).to.be.undefined;
      expect(response.body.user_id).to.be.undefined;
    });
  });
});
