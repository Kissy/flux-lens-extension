import moment from "moment";
import { Renderer } from "@k8slens/extensions";
import { KubeObjectMetadata } from "@k8slens/extensions/dist/src/common/k8s-api/kube-object";
import { LocalObjectReference } from "../common/local-object-reference";
import { ReconcilableSourceStatus } from "../common/reconcilable-source-status";
import { AccessFrom } from "../common/access-from";

export class GitRepository extends Renderer.K8sApi.KubeObject<
  KubeObjectMetadata,
  GitRepositoryStatus,
  GitRepositorySpec
> {
  static kind = "GitRepository";
  static namespaced = true;
  static apiBase = "/apis/source.toolkit.fluxcd.io/v1beta1/gitrepositories";

  static readonly GitOperationSucceedReason = "GitOperationSucceed";
  static readonly GitOperationFailedReason = "GitOperationFailed";

  getReconciledAge(): string | number {
    if (!this.status.artifact) {
      return "Never";
    }
    return moment(this.status.artifact?.lastUpdateTime).fromNow();
  }

  getStatusMessage(): string {
    if (this.spec.suspend) {
      return "Suspended";
    }

    const ready = this.status.conditions.find(({ type }) => type === "Ready");
    switch (ready.reason) {
      case GitRepository.GitOperationSucceedReason:
        return "Succeed";
      case GitRepository.GitOperationFailedReason:
        return "Failed";
      default:
        return ready.reason;
    }
  }

  getRevision(): string {
    return this.status.artifact?.revision;
  }

  getSecretDetailUrl(): string {
    const secretId = {
      namespace: this.metadata.namespace,
      name: this.spec.secretRef.name
    };
    return Renderer.Component.getDetailsUrl(
      Renderer.K8sApi.secretsApi.getUrl(secretId)
    );
  }
}

class GitRepositorySpec {
  url: string;
  secretRef?: LocalObjectReference;
  interval: string;
  timeout?: string;
  ref?: GitRepositoryRef;
  verify?: GitRepositoryVerification;
  ignore?: string;
  suspend?: boolean;
  gitImplementation?: string;
  recurseSubmodules?: boolean;
  include: GitRepositoryInclude[];
  accessFrom: AccessFrom;
}

class GitRepositoryRef {
  branch?: string;
  tag?: string;
  semver?: string;
  commit?: string;
}

class GitRepositoryVerification {
  mode: string;
  secretRef: LocalObjectReference;
}

class GitRepositoryInclude {
  repository: LocalObjectReference;
  fromPath: string;
  toPath: string;
}

class GitRepositoryStatus extends ReconcilableSourceStatus {}
