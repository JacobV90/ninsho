/* tslint:disable:max-line-length*/
/* tslint:disable:ter-prefer-arrow-callback*/
import 'mocha';
import { expect } from 'chai';
import { UserManagementController } from '../../../src/user_management/';
import { UserData, User } from 'auth0';
import { HttpError } from 'http-errors';
import { Auth0Config, Auth0 } from '../../../src/common/auth0';
const config: Auth0Config = require('../../../config.json').auth0;

describe('create_user_provider.spec.ts', function () {
  let userManagement: UserManagementController;
  before(() => {
    userManagement = new UserManagementController(new Auth0(config));
  });

  describe('Create User', () => {
    const userOneEmail: string = 'jvtalon901@yahoo.com';
    const userTwoEmail: string = 'testemail@gmail.com';
    let userId: string;

    it('should create a new user provided valid parameters', async function () {
      const userData: UserData = {
        email: userOneEmail,
        password: 'testPassword123',
      };

      const user: User = await userManagement.createUser(userData);
      if (user.user_id) {
        userId = user.user_id;
        expect(user).to.not.be.undefined;
        expect(user.email).to.equal(userOneEmail);

        // remove test user from database
        await userManagement.deleteUser({
          id: userId,
        });
      }
    });

    it('should NOT create a new user provided missing parameters (password)', function (done) {
      const userData: UserData = {
        email: userOneEmail,
      };

      userManagement.createUser(userData)
      .then(() => {
        expect.fail();
      })
      .catch((error: HttpError) => {
        expect(error.statusCode).to.equal(400);
        expect(error.message).to.equal('\"password\" is required');
        done();
      });
    });

    it('should NOT create a new user provided a password that does not meet strength requirements', function (done) {
      const userData: UserData = {
        email: userTwoEmail,
        password: 'test',
      };

      userManagement.createUser(userData)
      .then(() => {
        expect.fail();
      })
      .catch((error: HttpError) => {
        expect(error.statusCode).to.equal(400);
        expect(error.message).to.equal('PasswordStrengthError: Password is too weak');
        done();
      });
    });

    it('should NOT create new user provided missing parameters (email)', function (done) {
      const userData: UserData = {
        password: 'testPassword123',
      };

      userManagement.createUser(userData)
      .then(() => {
        expect.fail();
      })
      .catch((error: HttpError) => {
        expect(error.statusCode).to.equal(400);
        expect(error.message).to.equal('\"email\" is required');
        done();
      });
    });

    it('should NOT create new user provided an invalid email', function (done) {
      const userData: UserData = {
        email: 'thisisnotvalid',
        password: 'testPassword123',
      };

      userManagement.createUser(userData)
      .then(() => {
        expect.fail();
      })
      .catch((error: HttpError) => {
        expect(error.statusCode).to.equal(400);
        expect(error.message).to.equal('Payload validation error: \'Object didn\'t pass validation for format email: ' +
          userData.email + '\' on property email (The user\'s email).');
        done();
      });
    });
  });

  describe('Delete User', function () {

    let id: string;

    before(async () => {
      const user: User = await userManagement.createUser({
        email: 'vtalon007@yahoo.com',
        password: 'testPassword123',
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
