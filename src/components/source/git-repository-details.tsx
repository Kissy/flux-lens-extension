import { Common, Renderer } from "@k8slens/extensions";
import { kebabCase } from "lodash";
import React, { ReactNode } from "react";
import { GitRepository } from "../../apis/source/git-repository";
import { ExternalLink } from "../external-link";
import { Link } from "react-router-dom";

export interface FluxGitRepositoryDetailsProps
  extends Renderer.Component.KubeObjectDetailsProps<GitRepository> {}

export class GitRepositoryDetails extends React.Component<
  FluxGitRepositoryDetailsProps,
  any
> {
  render(): ReactNode {
    const { object: fluxGitRepository } = this.props;
    if (!fluxGitRepository) return null;
    return (
      <div className="FluxGitRepository">
        <Renderer.Component.KubeObjectMeta object={fluxGitRepository} />
        <Renderer.Component.DrawerItem name="Status">
          <span
            className={Common.Util.cssNames(
              "status",
              kebabCase(fluxGitRepository.getStatusMessage())
            )}
          >
            {fluxGitRepository.getStatusMessage()}
          </span>
        </Renderer.Component.DrawerItem>
        <Renderer.Component.DrawerItem name="Reconciled At">
          {fluxGitRepository.getReconciledAge()} ago (
          {fluxGitRepository.status.artifact?.lastUpdateTime})
        </Renderer.Component.DrawerItem>
        <Renderer.Component.DrawerItem name="URL">
          <ExternalLink url={fluxGitRepository.spec.url} />
        </Renderer.Component.DrawerItem>
        {fluxGitRepository.spec.secretRef && (
          <Renderer.Component.DrawerItem name="Secret">
            <Link to={fluxGitRepository.getSecretDetailUrl()}>
              {fluxGitRepository.spec.secretRef.name}
            </Link>
          </Renderer.Component.DrawerItem>
        )}
        <Renderer.Component.DrawerItem name="Interval">
          {fluxGitRepository.spec.interval}
        </Renderer.Component.DrawerItem>
        {fluxGitRepository.spec.timeout && (
          <Renderer.Component.DrawerItem name="Timeout">
            {fluxGitRepository.spec.timeout}
          </Renderer.Component.DrawerItem>
        )}
        {fluxGitRepository.spec.ref && (
          <React.Fragment>
            <Renderer.Component.DrawerItem
              name="Branch"
              hidden={!fluxGitRepository.spec.ref.branch}
            >
              {fluxGitRepository.spec.ref.branch}
            </Renderer.Component.DrawerItem>
            <Renderer.Component.DrawerItem
              name="Tag"
              hidden={!fluxGitRepository.spec.ref.tag}
            >
              {fluxGitRepository.spec.ref.tag}
            </Renderer.Component.DrawerItem>
            <Renderer.Component.DrawerItem
              name="Semver"
              hidden={!fluxGitRepository.spec.ref.semver}
            >
              {fluxGitRepository.spec.ref.semver}
            </Renderer.Component.DrawerItem>
            <Renderer.Component.DrawerItem
              name="Commit"
              hidden={!fluxGitRepository.spec.ref.commit}
            >
              {fluxGitRepository.spec.ref.commit}
            </Renderer.Component.DrawerItem>
          </React.Fragment>
        )}
        {fluxGitRepository.spec.verify && (
          <Renderer.Component.DrawerItem
            name="Verify"
            hidden={!fluxGitRepository.spec.verify.mode}
          >
            {fluxGitRepository.spec.verify.mode}
          </Renderer.Component.DrawerItem>
        )}
        {fluxGitRepository.spec.ignore && (
          <Renderer.Component.DrawerItem name="Ignore">
            <Renderer.Component.Input
              multiLine
              theme="round-black"
              className="box grow"
              value={fluxGitRepository.spec.ignore}
            />
          </Renderer.Component.DrawerItem>
        )}
        {fluxGitRepository.spec.gitImplementation && (
          <Renderer.Component.DrawerItem name="Git Implementation">
            {fluxGitRepository.spec.gitImplementation}
          </Renderer.Component.DrawerItem>
        )}
        {fluxGitRepository.spec.recurseSubmodules && (
          <Renderer.Component.DrawerItem name="Recurse submodules">
            {fluxGitRepository.spec.recurseSubmodules}
          </Renderer.Component.DrawerItem>
        )}
        {fluxGitRepository.spec.include && (
          <Renderer.Component.DrawerItem name="Includes">
            {fluxGitRepository.spec.include.map(repo => {
              // TODO prettify
              return (
                <Renderer.Component.Input
                  multiLine
                  theme="round-black"
                  className="box grow"
                  value={JSON.stringify(repo)}
                />
              );
            })}
          </Renderer.Component.DrawerItem>
        )}
        {
          // TODO accessFrom
        }
      </div>
    );
  }
}
