import "./helm-releases.scss";

import {Renderer, Common} from "@k8slens/extensions";
import React from "react";
import {helmReleasesStore} from "../../apis/helm/helm-releases-store";
import {HelmRelease} from "../../apis/helm/helm-release"
import {Link} from "react-router-dom";

enum columnId {
    name = "name",
    namespace = "namespace",
    chart = "chart",
    interval = "interval",
    suspend = "suspend",
    age = "age",
    status = "status",
}

export class HelmReleases extends React.Component<{ extension: Renderer.LensExtension }, any> {

    render() {
        return (
            <Renderer.Component.KubeObjectListLayout
                className="FluxHelmReleases" store={helmReleasesStore}
                tableId="flux-helm-releases"
                isConfigurable
                sortingCallbacks={{
                    //[sortBy.name]: (certificate: Certificate) => certificate.getName(),
                    //[sortBy.namespace]: (certificate: Certificate) => certificate.metadata.namespace,
                }}
                searchFilters={[
                    (helmRelease: HelmRelease) => helmRelease.getSearchFields()
                ]}
                renderHeaderTitle="Helm Releases"
                renderTableHeader={[
                    {title: "Name", className: "name", sortBy: columnId.name, id: columnId.name},
                    {title: "Namespace", className: "namespace", sortBy: columnId.namespace, id: columnId.namespace},
                    {title: "Chart", className: "chart", sortBy: columnId.chart, id: columnId.chart},
                    {title: "Interval", className: "interval", sortBy: columnId.interval, id: columnId.interval},
                    {title: "Age", className: "age", sortBy: columnId.age, id: columnId.age},
                    {title: "Status", className: "status", sortBy: columnId.status, id: columnId.status},
                ]}
                renderTableContents={(helmRelease: HelmRelease) => [
                    helmRelease.getName(),
                    helmRelease.metadata.namespace,
                    <Link to={helmRelease.getSourceDetailUrl()} onClick={Common.Util.stopPropagation}>{helmRelease.spec.chart.spec.chart}</Link>,
                    helmRelease.spec.interval,
                    helmRelease.getAge(),
                    { title: helmRelease.getStatusMessage(), className: helmRelease.getStatusClassName() }
                ]}
            />
        )
    }
}
