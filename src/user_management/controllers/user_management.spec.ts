/* tslint:disable:max-line-length*/

import 'mocha';
import { expect } from 'chai';
import { Auth0Config, UserManagement } from './user_management';
import { CreateUserData, User } from 'auth0';
import { HttpError } from 'http-errors';
const config: Auth0Config = require('../../../config.json').auth0;

describe('user_management.spec.ts', () => {

  describe('Signup New User', () => {
    const userOneEmail: string = 'jvtalon901@yahoo.com';
    const userTwoEmail: string = 'testemail@gmail.com';
    let userManagement: UserManagement;
    let userId: string;

    before(() => {
      userManagement = new UserManagement(config);
    });

    it('should sign up a new user provided valid parameters', async () => {
      const userData: CreateUserData = {
        email: userOneEmail,
        password: 'testPassword123',
        connection: 'Username-Password-Authentication',
      };

      const user: User = await userManagement.signupNewUser(userData);
      userId = user.user_id;
      expect(user).to.not.be.undefined;
      expect(user.email).to.equal(userOneEmail);

      // remove test user from database
      await userManagement.deleteUser({
        id: userId,
      });
    });

    it('should NOT sign up a new user provided missing parameters (password)', (done) => {
      const userData: CreateUserData = {
        email: userOneEmail,
        connection: 'Username-Password-Authentication',
      };

      userManagement.signupNewUser(userData)
      .then(() => {
        expect.fail();
      })
      .catch((error: HttpError) => {
        expect(error.statusCode).to.equal(400);
        expect(error.message).to.equal('\"password\" is required');
        done();
      });
    });

    it('should NOT sign up a new user provided missing parameters (email)', (done) => {
      const userData: CreateUserData = {
        password: 'testPassword123',
        connection: 'Username-Password-Authentication',
      };

      userManagement.signupNewUser(userData)
      .then(() => {
        expect.fail();
      })
      .catch((error: HttpError) => {
        expect(error.statusCode).to.equal(400);
        expect(error.message).to.equal('\"email\" is required');
        done();
      });
    });

    it('should NOT sign up a new user provided missing parameters (connection)', (done) => {
      const userData: CreateUserData = {
        password: 'testPassword123',
        email: userOneEmail,
        connection: '',
      };

      userManagement.signupNewUser(userData)
      .then(() => {
        expect.fail();
      })
      .catch((error: HttpError) => {
        expect(error.statusCode).to.equal(400);
        expect(error.message).to.equal('The connection does not exist.');
        done();
      });
    });

    it('should NOT sign up a new user provided a password that does not meet requirements', (done) => {
      const userData: CreateUserData = {
        email: userTwoEmail,
        password: 'test',
        connection: 'Username-Password-Authentication',
      };

      userManagement.signupNewUser(userData)
      .then(() => {
        expect.fail();
      })
      .catch((error: HttpError) => {
        expect(error.statusCode).to.equal(400);
        expect(error.message).to.equal('PasswordStrengthError: Password is too weak');
        done();
      });
    });
  });
});
