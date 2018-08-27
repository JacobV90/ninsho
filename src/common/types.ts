export interface ObjectWithAny extends Object{
  /**
   * Supports object key indexing when using strict type checking
   */
  [key:string]: any;
}

export interface DeleteUserData {
  /**
   * The id of the user to be deleted
   */
  id: string;
}

export interface EmailOrId {
  /**
   * The id of the user
   */
  id?: string;

  /**
   * The email of the user
   */
  email?: string;
}

export interface UpdateUserData {
  user_id: string;
  email?: string;
  phone_number?: string;
  user_metadata?: ObjectWithAny;
  user_name?: string;
}

export interface AddBeforeHookDataToUser {
  /**
   * If true, data returned by the before hook will be attached to the
   * "user_metadata" property before creating a new user
   */
  attachToUser?: boolean;

  /**
   * If specified, only these fields will be added to the 'user_metadata' field
   */
  propsToAdd?: string[];

  /**
   * Allows any number of properties of any type
   */
  data: ObjectWithAny | undefined;
}
