import { Chance } from 'chance';

const randomGen: Chance.Chance =  new Chance(Math.random);

export function randomEmail() {
  return randomGen.email();
}

export function randomPassword() {
  return randomGen.string({ length: 4 }) +
    randomGen.string({ length: 4 , pool: 'ASDFGHKJ' }) +
    randomGen.integer();
}
