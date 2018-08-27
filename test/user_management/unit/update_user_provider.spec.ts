/* tslint:disable:max-line-length*/
/* tslint:disable:ter-prefer-arrow-callback*/

import 'mocha';
import { expect } from 'chai';
import { UserManagementController } from '../../../src/user_management/';
import { User, UpdateUserData, CreateUserData } from 'auth0';
import { HttpError } from 'http-errors';
import { Auth0Config, Auth0 } from '../../../src/common/auth0';
import { randomEmail, randomPassword, randomString, AuthConnections } from '../../helpers/';
import { ObjectWithAny } from '../../../src/common/types';

const config: Auth0Config = require('../../../config.json').auth0;

describe('update_user_provider.spec.ts', function () {
  let userManagement: UserManagementController;
  before(() => {
    userManagement = new UserManagementController(new Auth0(config));
  });

  describe('Update User', () => {
    it('should update a users email and user metadata attributes', async function () {
      // SETUP
      const userData: CreateUserData = {
        email: randomEmail(),
        password: randomPassword(),
        connection: AuthConnections.defaultConnection,
      };

      let user: User = await userManagement.createUser(userData);
      // END SETUP

      const updateUserData: UpdateUserData = {
        email: randomEmail(),
        user_metadata: {
          test: 'test',
        },
      };
      if (user.user_id) {
        const userId = user.user_id;
        user = await userManagement.updateUser(user.user_id, updateUserData);
        expect(user).to.not.be.undefined;
        expect(user.email).to.equal(updateUserData.email);
        expect((user.user_metadata as ObjectWithAny).test).to
        .equal((updateUserData.user_metadata as ObjectWithAny).test);

        // remove test user from database
        await userManagement.deleteUser({
          id: userId,
        });
      }
    });

    it('should not update a users email attribute provided an invalid email', async function () {
      // SETUP
      const userData: CreateUserData = {
        email: randomEmail(),
        password: randomPassword(),
        connection: AuthConnections.defaultConnection,
      };

      const user: User = await userManagement.createUser(userData);
      // END SETUP

      const updateUserData: UpdateUserData = {
        email: 'not valid',
      };
      if (user.user_id) {
        const userId = user.user_id;
        await userManagement.updateUser(user.user_id, updateUserData)
        .then(() => {
          expect.fail();
        })
        .catch(async (error: HttpError) => {
          expect(error.statusCode).to.equal(400);
          expect(error.message).to.equal('Payload validation error: \'Object didn\'t pass validation for format email: ' +
            updateUserData.email + '\' on property email (The new email).');
        });

        // clean up
        await userManagement.deleteUser({
          id: userId,
        });
      }
    });

    it('should not update a users phone number attribute for an application without SMS', async function () {
      // SETUP
      const userData: CreateUserData = {
        email: randomEmail(),
        password: randomPassword(),
        connection: AuthConnections.defaultConnection,
      };

      const user: User = await userManagement.createUser(userData);
      // END SETUP

      const updateUserData: UpdateUserData = {
        phone_number: '+15555555555',
      };
      if (user.user_id) {
        const userId = user.user_id;
        await userManagement.updateUser(user.user_id, updateUserData)
        .then(() => {
          expect.fail();
        })
        .catch(async (error: HttpError) => {
          expect(error.statusCode).to.equal(400);
          expect(error.message).to.equal('Cannot update phone_number for non-sms user');
        });

        // clean up
        await userManagement.deleteUser({
          id: userId,
        });
      }
    });
  });

  describe('Update User w/Username', function () {
    let user: User;
    let userData: CreateUserData;
    before(async() => {
      userData = {
        email: randomEmail(),
        username: randomString({ length: 10, pool: 'asdfghjklqwertyuiop' }),
        password: randomPassword(),
        connection: AuthConnections.userNameConnection,
      };

      user = await userManagement.createUser(userData);
    });
    it('should update a users username attribute', async function () {
      const updateUserData: UpdateUserData = {
        username: 'onetimer',
        connection: AuthConnections.userNameConnection,
      };
      if (user.user_id) {
        const userId = user.user_id;
        user = await userManagement.updateUser(user.user_id , updateUserData);
        expect(user).to.not.be.undefined;
        expect(user.username).to.equal(updateUserData.username);

        // remove test user from database
        await userManagement.deleteUser({
          id: userId,
        });
      }
    });

    it('should not update a users username attribute that does not meet requirements', async function () {
      // setup
      const updateUserData: UpdateUserData = {
        username: '',
        connection: AuthConnections.userNameConnection,
      };
      if (user.user_id) {
        const userId = user.user_id;
        await userManagement.updateUser(user.user_id , updateUserData)
        .then(() => {
          expect.fail();
        })
        .catch((error: HttpError) => {
          expect(error.statusCode).to.equal(400);
          expect(error.message).to.equal('Payload validation error: \'String is too short (0 chars), minimum 1\' on' +
            ' property username (The user\'s username. Only valid if the connection requires a username).');
        });
        // remove test user from database
        await userManagement.deleteUser({
          id: userId,
        });
      }
    });
  });
});
