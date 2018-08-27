import { Chance } from 'chance';
import {ObjectWithAny} from '../../src/common/types';

const randomGen: Chance.Chance =  new Chance(Math.random);

export function randomEmail() {
  return randomGen.email();
}

export function randomPassword() {
  return randomGen.word({ length: 5 }) +
    randomGen.string({ length: 4 , pool: 'ASDFGHKJ' }) +
    randomGen.integer({ min: 0, max: 100 });
}

export function randomString(opts?: ObjectWithAny) {
  return randomGen.string(opts);
}
