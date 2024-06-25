import { SharedEnvironment } from 'phoga-shared';

export interface Environment extends SharedEnvironment {
  auth0_clientId: string;
  auth0_domain: string;
  auth0_audience: string;
}
