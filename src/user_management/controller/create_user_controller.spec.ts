/* tslint:disable:max-line-length*/

import 'mocha';
import { expect } from 'chai';
import { Auth0Config, UserManagementController } from './controller';
import { UserData, User } from 'auth0';
import { HttpError } from 'http-errors';
const config: Auth0Config = require('../../../config.json').auth0;

describe('Create User', () => {
  const userOneEmail: string = 'jvtalon901@yahoo.com';
  const userTwoEmail: string = 'testemail@gmail.com';
  let userManagement: UserManagementController;
  let userId: string;

  before(() => {
    userManagement = new UserManagementController(config);
  });

  it('should create a new user provided valid parameters', async () => {
    const userData: UserData = {
      email: userOneEmail,
      password: 'testPassword123',
    };

    const user: User = await userManagement.createUser(userData);
    userId = user.user_id;
    expect(user).to.not.be.undefined;
    expect(user.email).to.equal(userOneEmail);

    // remove test user from database
    await userManagement.deleteUser({
      id: userId,
    });
  });

  it('should NOT create a new user provided missing parameters (password)', (done) => {
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

  it('should NOT create new user provided missing parameters (email)', (done) => {
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

  it('should NOT create a new user provided a password that does not meet requirements', (done) => {
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
});
