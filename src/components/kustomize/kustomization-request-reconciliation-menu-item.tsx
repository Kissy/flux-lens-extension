import React from "react";
import { Renderer } from "@k8slens/extensions";
import { Kustomization } from "../../apis/kustomize/kustomization";
import { kustomizationsStore } from "../../apis/kustomize/kustomizations-store";
import CreateRequestReconcilePatchOperation from "../../utils/create-request-reconcile-patch-operation";


const {
    Component: {
        Notifications,
        MenuItem,
        Icon,
    },
} = Renderer;

export function KustomizationRequestReconciliationMenuItem(props: Renderer.Component.KubeObjectMenuProps<Kustomization>) {
    const {object: fluxObject, toolbar } = props;
    if (!fluxObject) {
        return null;
    }

    async function reconcile(fluxObject: Kustomization) {
        try {
            let patchOperation = CreateRequestReconcilePatchOperation(fluxObject);
            await kustomizationsStore.patch(fluxObject, [patchOperation]);
            Notifications.ok(
                <p>
                    <><b>{fluxObject.getName()}</b> reconciliation requested.</>
                </p>,
            );
        } catch (error) {
            Notifications.error(`Failed to request reconciliation: ${error}`);
        }
    }

    return (
        <MenuItem onClick={() => reconcile(fluxObject)}>
            <Icon material="sync" interactive={toolbar} title="Request Reconciliation"/>
            <span className="title">Request Reconciliation</span>
        </MenuItem>
    );
}
