import { Renderer } from "@k8slens/extensions";
import { LocalObjectReference } from "../common/local-object-reference";
import { KubeObjectMetadata } from "@k8slens/extensions/dist/src/common/k8s-api/kube-object";
import { ReconcilableSourceStatus } from "../common/reconcilable-source-status";

export class Bucket extends Renderer.K8sApi.KubeObject<
  KubeObjectMetadata,
  BucketStatus,
  BucketSpec
> {
  static kind = "Bucket";
  static namespaced = true;
  static apiBase = "/apis/source.toolkit.fluxcd.io/v1beta2/buckets";
}

class BucketSpec {
  provider: string;
  bucketName: string;
  endpoint: string;
  insecure: boolean;
  region: string;
  secretRef: LocalObjectReference;
  interval: string;
  timeout: string;
  ignore: string;
  suspend: boolean;
}

class BucketStatus extends ReconcilableSourceStatus {}
