import React from "react";
import { Renderer } from "@k8slens/extensions";
import { GitRepository } from "../../apis/source/git-repository";
import { gitRepositoriesStore } from "../../apis/source/git-repositories-store";
import { Operation } from "rfc6902";
import CreateRequestReconcilePatchOperation from "../../utils/create-request-reconcile-patch-operation";

const {
    Component: {
        Notifications,
        MenuItem,
        Icon,
    },
} = Renderer;

export function GitRepositoryRequestReconciliationMenuItem(props: Renderer.Component.KubeObjectMenuProps<GitRepository>) {
    const {object: fluxObject, toolbar } = props;
    if (!fluxObject) {
        return null;
    }

    async function reconcile(fluxObject: GitRepository) {
        try {
            let patchOperation = CreateRequestReconcilePatchOperation(fluxObject);
            await gitRepositoriesStore.patch(fluxObject, [patchOperation]);
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
