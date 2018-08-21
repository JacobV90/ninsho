import { CreateUserData, ManagementClient, User, UserData } from 'auth0';

export interface Auth0Config {
  token: string;
  domain: string;
  connection?: string;
}

export interface DeleteUserData {
  id: string;
}

export class UserManagementController{

  private managementClient: ManagementClient;
  private connection: string;

  constructor(config: Auth0Config) {
    this.managementClient = new ManagementClient(config);
    this.connection = config.connection || 'Username-Password-Authentication';
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
