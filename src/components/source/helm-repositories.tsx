import "./helm-repositories.scss";

import {Renderer, Common} from "@k8slens/extensions";
import React from "react";
import {helmRepositoriesStore} from "../../apis/source/helm-repository-store";
import {HelmRepository} from "../../apis/source/helm-repository"
import kebabCase from "lodash/kebabCase";

enum columnId {
    name = "name",
    namespace = "namespace",
    url = "url",
    interval = "interval",
    age = "age",
    revision = "revision",
    reconciled = "reconciled",
    status = "status",
}

export class HelmRepositories extends React.Component<{ extension: Renderer.LensExtension }, any> {

    render() {
        return (
            <Renderer.Component.KubeObjectListLayout
                className="FluxHelmRepositories" store={helmRepositoriesStore}
                tableId="flux-helm-charts"
                isConfigurable
                sortingCallbacks={{
                    //[sortBy.name]: (certificate: Certificate) => certificate.getName(),
                    //[sortBy.namespace]: (certificate: Certificate) => certificate.metadata.namespace,
                }}
                searchFilters={[
                    (helmRepository: HelmRepository) => helmRepository.getSearchFields()
                ]}
                renderHeaderTitle="Helm Charts"
                renderTableHeader={[
                    {title: "Name", className: "name", sortBy: columnId.name, id: columnId.name},
                    {title: "Namespace", className: "namespace", sortBy: columnId.namespace, id: columnId.namespace},
                    {title: "URL", className: "url", sortBy: columnId.url, id: columnId.url},
                    {title: "Interval", className: "interval", sortBy: columnId.interval, id: columnId.interval},
                    {title: "Age", className: "age", sortBy: columnId.age, id: columnId.age},
                    {title: "Revision", className: "revision", sortBy: columnId.revision, id: columnId.revision},
                    {title: "Reconciled", className: "reconciled", sortBy: columnId.reconciled, id: columnId.reconciled},
                    {title: "Status", className: "status", sortBy: columnId.status, id: columnId.status},
                ]}
                renderTableContents={(helmRepository: HelmRepository) => [
                    helmRepository.getName(),
                    helmRepository.metadata.namespace,
                    <a href="#" onClick={Common.Util.prevDefault(helmRepository.openUrl)}>{helmRepository.spec.url}</a>,
                    helmRepository.spec.interval,
                    helmRepository.getAge(),
                    helmRepository.getRevision(),
                    helmRepository.getReconciledAge(),
                    {title: helmRepository.getStatusMessage(), className: kebabCase(helmRepository.getStatusMessage())}
                ]}
            />
        )
    }
}
