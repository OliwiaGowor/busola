import { AuthDataState } from 'state/authDataAtom';
import { ActiveClusterState } from 'state/clusterAtom';
import { SsoDataState } from 'state/ssoDataAtom';

export function createAuthHeaders(auth: AuthDataState) {
  if (!auth) {
    throw Error('No available data to authenticate the request.');
  }

  if ('token' in auth) {
    return { 'X-K8s-Authorization': `Bearer ${auth.token}` };
  } else if (auth['client-certificate-data'] && auth['client-key-data']) {
    return {
      'X-Client-Certificate-Data': auth['client-certificate-data'],
      'X-Client-Key-Data': auth['client-key-data'],
    };
  }
}

function createSSOHeader(ssoData: SsoDataState) {
  if (ssoData) {
    return { Authorization: 'Bearer ' + ssoData.id_token };
  } else {
    return null;
  }
}

export function createHeaders(
  authData: AuthDataState,
  cluster: ActiveClusterState,
  ssoData: SsoDataState,
): HeadersInit {
  return {
    ...createAuthHeaders(authData),
    ...createSSOHeader(ssoData),
    'X-Cluster-Url': cluster?.currentContext.cluster.cluster.server,
    'X-Cluster-Certificate-Authority-Data':
      cluster?.currentContext.cluster.cluster['certificate-authority-data'],
  } as HeadersInit;
}
