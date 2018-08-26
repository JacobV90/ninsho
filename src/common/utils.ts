/* tslint:disable:max-line-length*/

import { ObjectWithAny } from './types';

export function mergeObject(targetObject: ObjectWithAny, sourceObject: ObjectWithAny, propsToMerge?: string[]): void {
  if (propsToMerge) {
    for (const key of propsToMerge) {
      if (sourceObject.hasOwnProperty(key)) {
        targetObject[key] = sourceObject[key];
      }
    }
  } else {
    Object.assign(targetObject, sourceObject);
  }
}
