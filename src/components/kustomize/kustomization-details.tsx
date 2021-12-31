import { Common, Renderer } from "@k8slens/extensions";
import React, { ReactNode } from "react";
import { Kustomization } from "../../apis/kustomize/kustomization";

export interface FluxKustomizationDetailsProps
  extends Renderer.Component.KubeObjectDetailsProps<Kustomization> {}

export class KustomizationDetails extends React.Component<
  FluxKustomizationDetailsProps,
  any
> {
  render(): ReactNode {
    const { object: fluxKustomization } = this.props;
    if (!fluxKustomization) return null;
    return (
      <div className="FluxKustomization">
        <Renderer.Component.KubeObjectMeta object={fluxKustomization} />
        <Renderer.Component.DrawerItem name="Status">
          <span
            className={Common.Util.cssNames(
              "status",
              fluxKustomization.getStatusClassName()
            )}
          >
            {fluxKustomization.getStatusMessage()}
          </span>
        </Renderer.Component.DrawerItem>
        {fluxKustomization.spec.dependsOn && (
          <Renderer.Component.DrawerItem
            name="Depends On"
            className="depends-on"
            labelsOnly
          >
            {fluxKustomization.spec.dependsOn.map(dependency => {
              const { namespace, name } = dependency;
              return (
                <Renderer.Component.Badge
                  key={namespace + "/" + name}
                  label={namespace + "/" + name}
                />
              );
            })}
          </Renderer.Component.DrawerItem>
        )}
        {fluxKustomization.spec.patches && (
          <Renderer.Component.DrawerItem name="Patches">
            {fluxKustomization.spec.patches.map(patch => {
              // TODO prettify
              return (
                <div>
                  <p>{JSON.stringify(patch.target)}</p>
                  <Renderer.Component.Input
                    multiLine
                    theme="round-black"
                    className="box grow"
                    value={patch.patch}
                  />
                  <br />
                </div>
              );
            })}
          </Renderer.Component.DrawerItem>
        )}
        {fluxKustomization.spec.patchesStrategicMerge && (
          <Renderer.Component.DrawerItem name="Strategic Merge Patches">
            {fluxKustomization.spec.patchesStrategicMerge.map(patch => {
              // TODO prettify
              return (
                <Renderer.Component.Input
                  multiLine
                  theme="round-black"
                  className="box grow"
                  value={patch.raw}
                />
              );
            })}
          </Renderer.Component.DrawerItem>
        )}
        {fluxKustomization.spec.patchesJson6902 && (
          <Renderer.Component.DrawerItem name="JSON9602 Patches">
            {fluxKustomization.spec.patchesJson6902.map(patch => {
              // TODO prettify
              return (
                <div>
                  <p>{JSON.stringify(patch.target)}</p>
                  <Renderer.Component.Input
                    multiLine
                    theme="round-black"
                    className="box grow"
                    value={JSON.stringify(patch.patch)}
                  />
                </div>
              );
            })}
          </Renderer.Component.DrawerItem>
        )}
        <Renderer.Component.DrawerItem name="Interval">
          {fluxKustomization.spec.interval}
        </Renderer.Component.DrawerItem>
        <Renderer.Component.DrawerItem name="Target Namespace">
          {fluxKustomization.spec.targetNamespace}
        </Renderer.Component.DrawerItem>
        <Renderer.Component.DrawerItem name="Service Account">
          {fluxKustomization.spec.serviceAccountName}
        </Renderer.Component.DrawerItem>
      </div>
    );
  }
}
