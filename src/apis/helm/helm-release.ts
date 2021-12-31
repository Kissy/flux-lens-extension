import { Renderer } from "@k8slens/extensions";
import { KubeObjectMetadata } from "@k8slens/extensions/dist/src/common/k8s-api/kube-object";
import { ReconcilableStatus } from "../common/reconcilable-status";
import { CrossNamespaceSourceReference } from "../common/cross-namespace-source-reference";
import { KubeConfig } from "../common/kubeconfig";
import { helmChartsApi } from "../source/helm-charts-store";

export class HelmRelease extends Renderer.K8sApi.KubeObject<
  KubeObjectMetadata,
  HelmReleaseStatus,
  HelmReleaseSpec
> {
  static kind = "HelmRelease";
  static namespaced = true;
  static apiBase = "/apis/helm.toolkit.fluxcd.io/v2beta1/helmreleases";

  static readonly InstallSucceededReason = "InstallSucceeded";
  static readonly InstallFailedReason = "InstallFailed";
  static readonly UpgradeSucceededReason = "UpgradeSucceeded";
  static readonly UpgradeFailedReason = "UpgradeFailed";
  static readonly TestSucceededReason = "TestSucceeded";
  static readonly TestFailedReason = "TestFailed";
  static readonly RollbackSucceededReason = "RollbackSucceeded";
  static readonly RollbackFailedReason = "RollbackFailed";
  static readonly UninstallSucceededReason = "UninstallSucceeded";
  static readonly UninstallFailedReason = "UninstallFailed";
  static readonly ArtifactFailedReason = "ArtifactFailed";
  static readonly InitFailedReason = "InitFailed";
  static readonly GetLastReleaseFailedReason = "GetLastReleaseFailed";

  getStatusMessage(): string {
    if (this.spec.suspend) {
      return "Suspended";
    }

    const ready = this.status.conditions.find(({ type }) => type === "Ready");
    // TODO complete
    switch (ready.reason) {
      case HelmRelease.InstallSucceededReason:
        return "Succeed";
      case HelmRelease.InstallFailedReason:
        return "Failed";
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
    const helmChartComponent = this.status.helmChart.split("/");
    const helmChartId = {
      namespace: helmChartComponent[0],
      name: helmChartComponent[1]
    };
    return Renderer.Component.getDetailsUrl(helmChartsApi.getUrl(helmChartId));
  }
}

class HelmReleaseSpec {
  chart: HelmChartTemplate;
  interval: string;
  suspend?: boolean;
  releaseName?: string;
  targetNamespace?: string;
  storageNamespace?: string;
  dependsOn?: CrossNamespaceSourceReference[];
  timeout?: string;
  maxHistory?: number;
  install?: Install;
  upgrade?: Upgrade;
  test?: Test;
  rollback?: Rollback;
  uninstall?: Uninstall;
  valuesFrom: ValuesReference[];
  values?: string; // TODO JSON ?
  kubeConfig?: KubeConfig;
  serviceAccountName?: string;
  postRenderers: PostRenderer[];
}

class HelmChartTemplate {
  spec: HelmChartTemplateSpec;
}

class HelmChartTemplateSpec {
  chart: string;
  version: string;
  sourceRef: CrossNamespaceSourceReference;
  interval: string;
  valuesFiles: string[];
  valuesFile: string;
}

class Install {}

class Upgrade {
  timeout: string;
  // TODO remediation
  // TODO Upgrade & Rollback unified
}

class Test {
  enable: boolean;
  timeout: string;
  ignoreFailures: boolean;
}

class Rollback {
  timeout: string;
  disableWait: boolean;
  disableWaitForJobs: boolean;
  disableHooks: boolean;
  recreate: boolean;
  force: boolean;
  cleanupOnFail: boolean;
}

class Uninstall {
  timeout: string;
  disableHooks: boolean;
  keepHistory: boolean;
}

class ValuesReference {
  kind: string;
  name: string;
  valuesKey: string;
  targetPath: string;
  optional: boolean;
}

class PostRenderer {
  // TODO kustomize: Kustomize;
}

class HelmReleaseStatus extends ReconcilableStatus {
  lastAppliedRevision: string;
  lastAttemptedRevision: string;
  //snapshot: Snapshot;
  helmChart: string;
}
