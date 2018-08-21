import { CreateUserData, ManagementClient, User } from 'auth0';

export interface Auth0Config {
  token: string;
  domain: string;
}

export interface DeleteUserData {
  id: string;
}

export class UserManagement {

  private managementClient: ManagementClient;

  constructor(config: Auth0Config) {
    this.managementClient = new ManagementClient(config);
  }

  public async signupNewUser(userData: CreateUserData): Promise<User> {
    let user;
    try {
      user = await this.managementClient.createUser(userData);
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
