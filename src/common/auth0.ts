import { AuthenticationClient, ManagementClient } from 'auth0';

export interface Auth0Config {
  domain: string;
  clientId: string;
  clientSecret: string;
  connection?: string;
}

/**
 * The Auth0 class configures and exposes Auth0's ManagementClient and AuthenticationClient
 * classes.
 */
export class Auth0 {

  /**
   * Auth0's management client class.
   * https://auth0.github.io/node-auth0/module-management.ManagementClient.html
   */
  public managementClient: ManagementClient;

  /**
   * Auth0's authentication client class.
   * https://auth0.github.io/node-auth0/module-auth.AuthenticationClient.html
   */
  public authenticationClient: AuthenticationClient;

  /**
   * The applications client id
   */
  public clientId: string;

  constructor(config: Auth0Config) {
    this.managementClient = new ManagementClient(config);
    this.authenticationClient = new AuthenticationClient(config);
    this.clientId = config.clientId;
  }
}
