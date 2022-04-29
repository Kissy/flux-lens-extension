import moment from "moment";
import { Common, Renderer } from "@k8slens/extensions";
import { KubeObjectMetadata } from "@k8slens/extensions/dist/src/common/k8s-api/kube-object";
import { ReconcilableSourceStatus } from "../common/reconcilable-source-status";
import React from "react";

export class HelmRepository extends Renderer.K8sApi.KubeObject<
  KubeObjectMetadata,
  HelmRepositoryStatus,
  HelmRepositorySpec
> {
  static kind = "HelmRepository";
  static namespaced = true;
  static apiBase = "/apis/source.toolkit.fluxcd.io/v1beta2/helmrepositories";

  static readonly IndexationFailedReason = "IndexationFailed";
  static readonly IndexationSucceededReason = "IndexationSucceed";

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
      case HelmRepository.IndexationSucceededReason:
        return "Succeed";
      case HelmRepository.IndexationFailedReason:
        return "Failed";
      default:
        return ready.reason;
    }
  }

  getRevision(): string {
    return this.status.artifact?.revision;
  }

  openUrl(event: React.MouseEvent<HTMLElement>) {
    Common.Util.openExternal(this.spec.url).then(() => {});
  }
}

class HelmRepositorySpec {
  url: string;
  secretRef?: {
    apiVersion: string;
    kind: string;
    name: string;
  };
  passCredentials?: boolean;
  interval: string;
  timeout?: string;
  suspend?: boolean;
}

class HelmRepositoryStatus extends ReconcilableSourceStatus {}
