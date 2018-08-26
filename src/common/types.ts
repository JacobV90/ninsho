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
