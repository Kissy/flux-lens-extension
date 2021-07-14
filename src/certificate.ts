import { K8sApi} from "@k8slens/extensions";

export class Certificate extends K8sApi.KubeObject {
  static kind = "Certificate"
  static namespaced = true
  static apiBase = "/apis/source.toolkit.fluxcd.io/v1beta1/gitrepositories"

  kind: string
  apiVersion: string
  metadata: {
    name: string;
    namespace: string;
    selfLink: string;
    uid: string;
    resourceVersion: string;
    creationTimestamp: string;
    labels: {
      [key: string]: string;
    };
    annotations: {
      [key: string]: string;
    };
  }
  spec: {
    interval: string;
    ref: {
      branch: string;
    }
    secretRef: {
      name: string;
    }
  }
  status: {
    conditions: {
      lastTransitionTime: string;
      message: string;
      reason: string;
      status: string;
      type?: string;
    }[];
  }
}