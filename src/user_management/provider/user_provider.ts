import {
  CreateUserData,
  ManagementClient,
  User,
  UserData,
  ObjectWithId,
  UpdateUserData,
} from 'auth0';
import { Auth0 } from '../../common/auth0';

/**
 * The UserManagementController uses Auth0's nodejs client to make the appropriate web calls
 * to their server. Methods not listed here are not supported by the Ninsho api service.
 */
export class UserManagementController{

  private managementClient: ManagementClient;
  private clientId: string;

  constructor(auth0: Auth0) {
    this.managementClient = auth0.managementClient;
    this.clientId = auth0.clientId;
    return this;
  }

  public async createUser(userData: CreateUserData): Promise<User> {
    try {
      return await this.managementClient.createUser(userData);
    } catch (error) {
      throw error;
    }
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
      return await this.managementClient.getUser(userId);
    } catch (error) {
      throw error;
    }
  }

  public async updateUser(id: string, userData: UserData): Promise<User> {
    const updateUserData: UpdateUserData = userData;
    if (userData.email || userData.phone_number || userData.username) {
      updateUserData.client_id = this.clientId;
      if (userData.email) {
        updateUserData.verify_email = true;
      }
      if (userData.phone_number) {
        updateUserData.verify_phone_number = true;
      }
    }
    try {
      return await this.managementClient.updateUser({ id }, updateUserData);
    } catch (error) {
      throw error;
    }
  }
}
