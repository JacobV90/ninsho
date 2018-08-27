/* tslint:disable:max-line-length*/
/* tslint:disable:ter-prefer-arrow-callback*/

import 'mocha';
import { expect } from 'chai';
import { UserManagementController } from '../../../src/user_management/';
import { User } from 'auth0';
import { Auth0Config, Auth0 } from '../../../src/common/auth0';
import { randomEmail, randomPassword } from '../../helpers/random_generator';

const config: Auth0Config = require('../../../config.json').auth0;

describe('get_user_provider.spec.ts', function () {
  let userManagement: UserManagementController;
  before(() => {
    userManagement = new UserManagementController(new Auth0(config));
  });

  describe('Get User', function () {

    let id: string;
    const email: string = randomEmail();

    before(async () => {
      const user: User = await userManagement.createUser({
        email,
        password: randomPassword(),
      });
      if (user.user_id) {
        id = user.user_id;
      }
    });

    after(async () => {
      await userManagement.deleteUser({ id });
    });

    it('should get a user provided a user id', function (done) {
      userManagement.getUser({ id })
      .then((user: User) => {
        expect(user.user_id).to.equal(id);
        expect(user.email).to.equal(email);
        done();
      })
      .catch(() => {
        expect.fail();
      });
    });

    it('should not get a user provided a user id that does not exist', function (done) {
      const id: string = 'nope';
      userManagement.getUser({ id })
      .then(() => {
        expect.fail();
      })
      .catch((error) => {
        expect(error.statusCode).to.equal(400);
        expect(error.message).to.equal('Object didn\'t pass validation for format user-id: ' + id);
        done();
      });
    });
  });
});
