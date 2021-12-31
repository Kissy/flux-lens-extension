import "./helm-charts.scss";

import { Renderer, Common } from "@k8slens/extensions";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { helmChartsStore } from "../../apis/source/helm-charts-store";
import { HelmChart } from "../../apis/source/helm-chart";
import kebabCase from "lodash/kebabCase";
import FluxExtension from "../../../renderer";

enum columnId {
  name = "name",
  namespace = "namespace",
  chart = "chart",
  version = "version",
  repository = "repository",
  interval = "interval",
  age = "age",
  revision = "revision",
  reconciled = "reconciled",
  status = "status"
}

export class HelmCharts extends React.Component<
  { extension: FluxExtension },
  any
> {
  render(): ReactNode {
    return (
      <Renderer.Component.KubeObjectListLayout
        className="FluxHelmCharts"
        store={helmChartsStore}
        tableId="flux-helm-charts"
        isConfigurable
        sortingCallbacks={
          {
            //[sortBy.name]: (certificate: Certificate) => certificate.getName(),
            //[sortBy.namespace]: (certificate: Certificate) => certificate.metadata.namespace,
          }
        }
        searchFilters={[(helmChart: HelmChart) => helmChart.getSearchFields()]}
        renderHeaderTitle="Helm Charts"
        renderTableHeader={[
          {
            title: "Name",
            className: "name",
            sortBy: columnId.name,
            id: columnId.name
          },
          {
            title: "Namespace",
            className: "namespace",
            sortBy: columnId.namespace,
            id: columnId.namespace
          },
          {
            title: "Chart",
            className: "chart",
            sortBy: columnId.chart,
            id: columnId.chart
          },
          {
            title: "Version",
            className: "version",
            sortBy: columnId.version,
            id: columnId.version
          },
          {
            title: "Repository",
            className: "repository",
            sortBy: columnId.repository,
            id: columnId.repository
          },
          {
            title: "Interval",
            className: "interval",
            sortBy: columnId.interval,
            id: columnId.interval
          },
          {
            title: "Age",
            className: "age",
            sortBy: columnId.age,
            id: columnId.age
          },
          {
            title: "Installed version ",
            className: "revision",
            sortBy: columnId.revision,
            id: columnId.revision
          },
          {
            title: "Reconciled",
            className: "reconciled",
            sortBy: columnId.reconciled,
            id: columnId.reconciled
          },
          {
            title: "Status",
            className: "status",
            sortBy: columnId.status,
            id: columnId.status
          }
        ]}
        renderTableContents={(helmChart: HelmChart) => [
          helmChart.getName(),
          helmChart.metadata.namespace,
          helmChart.spec.chart,
          helmChart.spec.version,
          <Link
            to={helmChart.getSourceDetailUrl()}
            onClick={Common.Util.stopPropagation}
          >
            {helmChart.spec.sourceRef.name}
          </Link>,
          helmChart.spec.interval,
          helmChart.getAge(),
          helmChart.getRevision(),
          helmChart.getReconciledAge(),
          {
            title: helmChart.getStatusMessage(),
            className: kebabCase(helmChart.getStatusMessage())
          }
        ]}
      />
    );
  }
}
