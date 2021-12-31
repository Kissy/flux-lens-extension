import "./git-repositories.scss";

import { Renderer } from "@k8slens/extensions";
import React, { ReactNode } from "react";
import { gitRepositoriesStore } from "../../apis/source/git-repositories-store";
import { GitRepository } from "../../apis/source/git-repository";
import kebabCase from "lodash/kebabCase";
import { ExternalLink } from "../external-link";
import FluxExtension from "../../../renderer";

enum columnId {
  name = "name",
  namespace = "namespace",
  url = "url",
  interval = "interval",
  age = "age",
  revision = "revision",
  reconciled = "reconciled",
  status = "status"
}

export class GitRepositories extends React.Component<
  { extension: FluxExtension },
  any
> {
  render(): ReactNode {
    return (
      <Renderer.Component.KubeObjectListLayout
        className="FluxGitRepositories"
        store={gitRepositoriesStore}
        tableId="flux-git-repositories"
        isConfigurable
        sortingCallbacks={
          {
            //[sortBy.name]: (certificate: Certificate) => certificate.getName(),
            //[sortBy.namespace]: (certificate: Certificate) => certificate.metadata.namespace,
          }
        }
        searchFilters={[
          (gitRepository: GitRepository) => gitRepository.getSearchFields()
        ]}
        renderHeaderTitle="Git Repositories"
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
            title: "URL",
            className: "url",
            sortBy: columnId.url,
            id: columnId.url
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
            title: "Revision",
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
        renderTableContents={(fluxGitRepository: GitRepository) => [
          fluxGitRepository.getName(),
          fluxGitRepository.metadata.namespace,
          <ExternalLink url={fluxGitRepository.spec.url} />,
          fluxGitRepository.spec.interval,
          fluxGitRepository.getAge(),
          fluxGitRepository.getRevision(),
          fluxGitRepository.getReconciledAge(),
          {
            title: fluxGitRepository.getStatusMessage(),
            className: kebabCase(fluxGitRepository.getStatusMessage())
          }
        ]}
      />
    );
  }
}
