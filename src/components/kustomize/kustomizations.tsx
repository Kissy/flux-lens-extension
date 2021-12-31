import "./kustomizations.scss";

import { Renderer, Common } from "@k8slens/extensions";
import React, { ReactNode } from "react";
import { kustomizationsStore } from "../../apis/kustomize/kustomizations-store";
import { Kustomization } from "../../apis/kustomize/kustomization";
import { Link } from "react-router-dom";
import FluxExtension from "../../../renderer";

enum columnId {
  name = "name",
  namespace = "namespace",
  source = "source",
  path = "path",
  interval = "interval",
  age = "age",
  status = "status"
}

export class Kustomizations extends React.Component<
  { extension: FluxExtension },
  any
> {
  render(): ReactNode {
    return (
      <Renderer.Component.KubeObjectListLayout
        className="FluxKustomizations"
        store={kustomizationsStore}
        tableId="flux-helm-kustomizations"
        isConfigurable
        sortingCallbacks={
          {
            //[sortBy.name]: (certificate: Certificate) => certificate.getName(),
            //[sortBy.namespace]: (certificate: Certificate) => certificate.metadata.namespace,
          }
        }
        searchFilters={[
          (kustomization: Kustomization) => kustomization.getSearchFields()
        ]}
        renderHeaderTitle="Kustomizations"
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
            title: "Source",
            className: "source",
            sortBy: columnId.source,
            id: columnId.source
          },
          {
            title: "Path",
            className: "path",
            sortBy: columnId.path,
            id: columnId.path
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
            title: "Status",
            className: "status",
            sortBy: columnId.status,
            id: columnId.status
          }
        ]}
        renderTableContents={(kustomization: Kustomization) => [
          kustomization.getName(),
          kustomization.metadata.namespace,
          <Link
            to={kustomization.getSourceDetailUrl()}
            onClick={Common.Util.stopPropagation}
          >
            {kustomization.spec.sourceRef.name}
          </Link>,
          kustomization.spec.path,
          kustomization.spec.interval,
          kustomization.getAge(),
          {
            title: kustomization.getStatusMessage(),
            className: kustomization.getStatusClassName()
          }
        ]}
      />
    );
  }
}
