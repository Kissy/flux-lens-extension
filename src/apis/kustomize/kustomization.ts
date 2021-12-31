import { Renderer } from "@k8slens/extensions";
import { KubeApi } from "@k8slens/extensions/dist/src/common/k8s-api/kube-api";
import {
  KubeObject,
  KubeObjectMetadata
} from "@k8slens/extensions/dist/src/common/k8s-api/kube-object";
import { NamespacedObjectKindReference } from "../common/namespaced-object-kind-reference";
import { ReconcilableStatus } from "../common/reconcilable-status";
import { CrossNamespaceSourceReference } from "../common/cross-namespace-source-reference";
import { LocalObjectReference } from "../common/local-object-reference";
import { KubeConfig } from "../common/kubeconfig";

export class Kustomization extends Renderer.K8sApi.KubeObject<
  KubeObjectMetadata,
  KustomizationStatus,
  KustomizationSpec
> {
  static kind = "Kustomization";
  static namespaced = true;
  static apiBase = "/apis/kustomize.toolkit.fluxcd.io/v1beta2/kustomizations";

  static readonly ReconciliationSucceededReason = "ReconciliationSucceeded";
  static readonly ReconciliationFailedReason = "ReconciliationFailed";
  static readonly ProgressingReason = "Progressing";
  static readonly DependencyNotReadyReason = "DependencyNotReady";
  static readonly PruneFailedReason = "PruneFailed";
  static readonly ArtifactFailedReason = "ArtifactFailed";
  static readonly BuildFailedReason = "BuildFailed";
  static readonly HealthCheckFailedReason = "HealthCheckFailed";

  getStatusMessage(): string {
    if (this.spec.suspend) {
      return "Suspended";
    }

    const ready = this.status.conditions.find(({ type }) => type === "Ready");
    switch (ready.reason) {
      case Kustomization.ReconciliationSucceededReason:
        return "Succeed";
      case Kustomization.ReconciliationFailedReason:
        return "Failed";
      case Kustomization.DependencyNotReadyReason:
        return "Dependency not Ready";
      case Kustomization.PruneFailedReason:
        return "Prune Failed";
      case Kustomization.ArtifactFailedReason:
        return "Artifact Failed";
      case Kustomization.BuildFailedReason:
        return "Build Failed";
      case Kustomization.HealthCheckFailedReason:
        return "Health Check Failed";
      default:
        return ready.reason;
    }
  }

  getStatusClassName(): string {
    const ready = this.status.conditions.find(({ type }) => type === "Ready");
    if (ready.reason.includes("Failed")) {
      return "failed";
    } else if (ready.reason.includes("Succeeded")) {
      return "succeed";
    }
    return "";
  }

  getSourceDetailUrl(): string {
    const sourceRef = this.spec.sourceRef;
    const matchingApi = Renderer.K8sApi.apiManager.getApi(
      (api: KubeApi<KubeObject>) => {
        const matchingVersion =
          !sourceRef.apiVersion || api.apiVersion == sourceRef.apiVersion;
        return (
          api.apiGroup == "source.toolkit.fluxcd.io" &&
          matchingVersion &&
          api.kind == sourceRef.kind
        );
      }
    );
    const namespace = sourceRef.namespace
      ? sourceRef.namespace
      : this.metadata.namespace;
    const sourceId = { namespace: namespace, name: sourceRef.name };
    return Renderer.Component.getDetailsUrl(matchingApi.getUrl(sourceId));
  }
}

class KustomizationSpec {
  dependsOn?: CrossNamespaceDependencyReference[];
  decryption: Decryption;
  interval: string;
  retryInterval: string;
  kubeConfig: KubeConfig;
  path: string;
  postBuild: PostBuild;
  prune: boolean;
  healthChecks: NamespacedObjectKindReference[];
  patches: Patch[];
  patchesStrategicMerge: PatchesStrategicMerge[];
  patchesJson6902: JSON6902Patch[];
  images: Image[];
  serviceAccountName: string;
  sourceRef: CrossNamespaceSourceReference;
  suspend: boolean;
  targetNamespace: string;
  timeout: string;
  force: boolean;
  wait: boolean;
}

class CrossNamespaceDependencyReference {
  namespace: string;
  name: string;
}

class Decryption {
  provider: string;
  secretRef: LocalObjectReference;
}

class PostBuild {
  // TODO substitute map[string]string;
  // TODO substituteFrom SubstituteReference[];
}

class Patch {
  patch: string;
  target: Selector;
}

class PatchesStrategicMerge {
  raw: string;
}

class JSON6902Patch {
  patch: JSON6902[];
  target: Selector;
}

class JSON6902 {
  op: string;
  path: string;
  from: string;
  value: string;
}

class Selector {
  group: string;
  version: string;
  kind: string;
  namespace: string;
  annotationSelector: string;
  labelSelector: string;
}

class Image {
  name: string;
  newName: string;
  newTag: string;
  digest: string;
}

class KustomizationStatus extends ReconcilableStatus {
  lastAppliedRevision: string;
  lastAttemptedRevision: string;
  //snapshot: Snapshot;
}
