/* tslint:disable:max-line-length*/
/* tslint:disable:ter-prefer-arrow-callback*/

import 'mocha';
import { expect } from 'chai';
import { UserManagementController } from '../../../src/user_management/';
import { User } from 'auth0';
import { Auth0Config, Auth0 } from '../../../src/common/auth0';
import { AuthConnections } from '../../helpers';

const config: Auth0Config = require('../../../config.json').auth0;

describe('delete_user_provider.spec.ts', function () {
  let userManagement: UserManagementController;
  before(() => {
    userManagement = new UserManagementController(new Auth0(config));
  });

  describe('Delete User', function () {

    let id: string;

    before(async () => {
      const user: User = await userManagement.createUser({
        email: 'vtalon007@yahoo.com',
        password: 'testPassword123',
        connection: AuthConnections.defaultConnection,
      });
      if (user.user_id) {
        id = user.user_id;
      }
    });

    it('should delete a user provided a user id', function (done) {
      userManagement.deleteUser({ id })
      .then(() => {
        done();
      })
      .catch(() => {
        expect.fail();
      });
    });

    it('should not delete a user provided a user id that does not exist', function (done) {
      const id: string = 'nope';
      userManagement.deleteUser({ id })
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
