import {Operation} from "rfc6902";
import {Renderer} from "@k8slens/extensions";

export default function CreateRequestReconcilePatchOperation(fluxObject: Renderer.K8sApi.KubeObject): Operation {
    if (!fluxObject.metadata.annotations) {
        return {
            "op": "add",
            "path": "/metadata/annotations",
            "value": {
                "reconcile.fluxcd.io/requestedAt": new Date().toISOString()
            }
        }
    } else {
        return {
            "op": "add",
            "path": "/metadata/annotations/reconcile.fluxcd.io~1requestedAt",
            "value": new Date().toISOString()
        }
    }
}
