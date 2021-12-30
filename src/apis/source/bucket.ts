import React from "react";
import moment from "moment";
import {Renderer, Common} from "@k8slens/extensions";
import {LocalObjectReference} from "../common/local-object-reference";
import {IKubeObjectMetadata} from "@k8slens/extensions/dist/src/renderer/api/kube-object";
import {Condition} from "../common/condition";
import {Artifact} from "../common/artifact";
import {ReconcilableStatus} from "../common/reconcilable-status";
import {ReconcilableSourceStatus} from "../common/reconcilable-source-status";

export class Bucket extends Renderer.K8sApi.KubeObject<IKubeObjectMetadata, BucketStatus, BucketSpec> {
    static kind = "Bucket"
    static namespaced = true
    static apiBase = "/apis/source.toolkit.fluxcd.io/v1beta1/buckets"

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

class BucketStatus extends ReconcilableSourceStatus {
}
