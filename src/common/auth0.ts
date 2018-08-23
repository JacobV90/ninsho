import { AuthenticationClient, ManagementClient } from 'auth0';

export interface Auth0Config {
  token: string;
  domain: string;
  connection?: string;
}

export class Auth0 {

  public managementClient: ManagementClient;
  public authenticationClient: AuthenticationClient;
  public connection: string;

  constructor(config: Auth0Config) {
    this.connection = config.connection || 'Username-Password-Authentication';
    this.managementClient = new ManagementClient(config);
    this.authenticationClient = new AuthenticationClient(config);
  }
}
