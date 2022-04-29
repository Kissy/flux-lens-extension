import { Renderer } from "@k8slens/extensions";
import { IKubeObjectMetadata } from "@k8slens/extensions/dist/src/renderer/api/kube-object";
import { LocalObjectReference } from "../common/local-object-reference";
import { CrossNamespaceSourceReference } from "../common/cross-namespace-source-reference";
import { Condition } from "../common/condition";

export class Alert extends Renderer.K8sApi.KubeObject<
  IKubeObjectMetadata,
  AlertStatus,
  AlertSpec
> {
  static kind = "GitRepository";
  static namespaced = true;
  static apiBase = "/apis/source.toolkit.fluxcd.io/v1beta2/gitrepositories";
}

// AlertSpec defines an alerting rule for events involving a list of objects
class AlertSpec {
  providerRef: LocalObjectReference;
  eventSeverity: string;
  eventSources: CrossNamespaceSourceReference[];
  exclusionList: string[];
  summary: string;
  suspend: boolean;
}

// AlertStatus defines the observed state of Alert
class AlertStatus {
  conditions: Condition[];
  observedGeneration: number;
}
