import { CreateUserData, ManagementClient, User, UserData } from 'auth0';
import { Auth0 } from '../../common/auth0';

export interface DeleteUserData {
  id: string;
}

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

  public async deleteUser(userData: DeleteUserData): Promise<void> {
    try {
      await this.managementClient.deleteUser(userData);
    } catch (error) {
      throw error;
    }
  }
}
