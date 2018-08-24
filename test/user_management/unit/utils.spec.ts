/* tslint:disable:ter-prefer-arrow-callback */
/* tslint:disable:max-line-length*/

import 'mocha';
import { expect } from 'chai';
import { mergeObject } from '../../../src/common/utils';
import { ObjectWithAny } from '../../../src/common/types';

describe('util.spec.ts', function () {

  describe('mergeObject', function () {
    interface TestInterface {
      email: string;
      password: string;
      address?: ObjectWithAny;
      access_token?: string;
      expiration?: number;
    }
    it('should merge an source objects properties and values into a target object', function (done) {
      const targetObj: ObjectWithAny = {};
      const sourceObj: TestInterface = {
        email: 'testemail@gmail.com',
        password: 'blah',
      };
      mergeObject(targetObj, sourceObj);
      expect(targetObj.email).to.equal(sourceObj.email);
      expect(targetObj.password).to.equal(sourceObj.password);
      done();
    });

    it('should merge only specified source objects properties and values into a target object', function (done) {
      const targetObj: ObjectWithAny = {};
      const sourceObj: TestInterface = {
        email: 'testemail@gmail.com',
        password: 'blah',
        address: {
          street: 'kelling',
        },
        access_token: 'ajflajsdfja;lsdkjf',
        expiration: 456465,
      };
      mergeObject(targetObj, sourceObj, ['email', 'password', 'address']);
      expect(targetObj.email).to.equal(sourceObj.email);
      expect(targetObj.password).to.equal(sourceObj.password);
      expect(targetObj.address.street).to.not.be.undefined;
      expect(targetObj.access_token).to.be.undefined;
      expect(targetObj.expiration).to.be.undefined;
      done();
    });

    it('should not merge specified source objects properties that do not exist', function (done) {
      const targetObj: ObjectWithAny = {};
      const sourceObj: TestInterface = {
        email: 'testemail@gmail.com',
        password: 'blah',
        address: {
          street: 'kelling',
        },
        access_token: 'ajflajsdfja;lsdkjf',
        expiration: 456465,
      };
      mergeObject(targetObj, sourceObj, ['does', 'not', 'exist']);
      expect(targetObj.email).to.be.undefined;
      expect(targetObj.password).to.be.undefined;
      expect(targetObj.address).to.be.undefined;
      expect(targetObj.access_token).to.be.undefined;
      expect(targetObj.expiration).to.be.undefined;
      done();
    });
  });
});
