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
