import { CreateUserData, ManagementClient, User, UserData, ObjectWithId } from 'auth0';
import { Auth0 } from '../../common/auth0';
import { DeleteUserData } from '../../common/types';

/**
 * The UserManagementController uses Auth0's nodejs client to make the appropriate web calls
 * to their server. Methods not listed here are not supported by the Ninsho api service.
 */
export class UserManagementController{

  private managementClient: ManagementClient;
  private connection: string;

  constructor(auth0: Auth0) {
    this.managementClient = auth0.managementClient;
    this.connection = auth0.connection;
    return this;
  }

  public async createUser(userData: UserData): Promise<User> {
    let user;
    const createUserData: CreateUserData = userData as CreateUserData;
    createUserData.connection = this.connection;
    try {
      user = await this.managementClient.createUser(createUserData);
    } catch (error) {
      throw error;
    }
    return user;
  }

  public async deleteUser(userId: ObjectWithId): Promise<void> {
    try {
      await this.managementClient.deleteUser(userId);
    } catch (error) {
      throw error;
    }
  }

  public async getUser(userId: ObjectWithId): Promise<User> {
    try {
      const response = await this.managementClient.getUser(userId);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
