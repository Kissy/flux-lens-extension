import moment from "moment";
import { Renderer } from "@k8slens/extensions";
import {
  KubeObject,
  KubeObjectMetadata
} from "@k8slens/extensions/dist/src/common/k8s-api/kube-object";
import { ReconcilableSourceStatus } from "../common/reconcilable-source-status";
import { KubeApi } from "@k8slens/extensions/dist/src/common/k8s-api/kube-api";

export class HelmChart extends Renderer.K8sApi.KubeObject<
  KubeObjectMetadata,
  HelmChartStatus,
  HelmChartSpec
> {
  static kind = "HelmChart";
  static namespaced = true;
  static apiBase = "/apis/source.toolkit.fluxcd.io/v1beta1/helmcharts";

  static readonly ChartPullFailedReason = "ChartPullFailed";
  static readonly ChartPullSucceededReason = "ChartPullSucceeded";
  static readonly ChartPackageFailedReason = "ChartPackageFailed";
  static readonly ChartPackageSucceededReason = "ChartPackageSucceeded";

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
      case HelmChart.ChartPullFailedReason:
        return "Pull Failed";
      case HelmChart.ChartPullSucceededReason:
        return "Pull Succeed";
      case HelmChart.ChartPackageFailedReason:
        return "Package Failed";
      case HelmChart.ChartPackageSucceededReason:
        return "Package Succeed";
      default:
        return ready.reason;
    }
  }

  getRevision(): string {
    return this.status.artifact?.revision;
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
    const sourceId = {
      namespace: this.metadata.namespace,
      name: sourceRef.name
    };
    return Renderer.Component.getDetailsUrl(matchingApi.getUrl(sourceId));
  }
}

class HelmChartSpec {
  chart: string;
  version?: string;
  sourceRef: LocalHelmChartSourceReference;
  interval: string;
  reconcileStrategy?: string;
  valuesFiles?: [string];
  valuesFile?: string;
  suspend?: boolean;
}

class LocalHelmChartSourceReference {
  apiVersion: string;
  kind: string;
  name: string;
}

class HelmChartStatus extends ReconcilableSourceStatus {}
