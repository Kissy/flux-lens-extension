import {Common, Renderer} from "@k8slens/extensions";
import React from "react";
import {HelmChart} from "../../apis/source/helm-chart";
import {kebabCase} from "lodash";
import {Link} from "react-router-dom";

export interface FluxHelmChartDetailsProps extends Renderer.Component.KubeObjectDetailsProps<HelmChart> {
}

export class HelmChartDetails extends React.Component<FluxHelmChartDetailsProps, any> {
    render() {
        const {object: fluxHelmChart} = this.props;
        if (!fluxHelmChart) return null;
        return (
            <div className="FluxHelmChart">
                <Renderer.Component.KubeObjectMeta object={fluxHelmChart}/>
                <Renderer.Component.DrawerItem name="Status">
                    <span className={Common.Util.cssNames("status", kebabCase(fluxHelmChart.getStatusMessage()))}>{fluxHelmChart.getStatusMessage()}</span>
                </Renderer.Component.DrawerItem>
                <Renderer.Component.DrawerItem name="Reconciled At">
                    {fluxHelmChart.getReconciledAge()} ago ({fluxHelmChart.status.artifact?.lastUpdateTime})
                </Renderer.Component.DrawerItem>
                <Renderer.Component.DrawerItem name="Chart">
                    {fluxHelmChart.spec.chart}
                </Renderer.Component.DrawerItem>
                {fluxHelmChart.spec.version &&
                <Renderer.Component.DrawerItem name="Version">
                    {fluxHelmChart.spec.version}
                </Renderer.Component.DrawerItem>
                }
                <Renderer.Component.DrawerItem name="Repository">
                    <Link to={fluxHelmChart.getSourceDetailUrl()}>{fluxHelmChart.spec.sourceRef.name}</Link>
                </Renderer.Component.DrawerItem>
                <Renderer.Component.DrawerItem name="Interval">
                    {fluxHelmChart.spec.interval}
                </Renderer.Component.DrawerItem>
                <Renderer.Component.DrawerItem name="Reconcile Strategy">
                    {fluxHelmChart.spec.reconcileStrategy}
                </Renderer.Component.DrawerItem>
                {fluxHelmChart.spec.valuesFiles &&
                <Renderer.Component.DrawerItem name="Values Files">
                    {
                        fluxHelmChart.spec.valuesFiles.map(file => {
                            return (
                                <Renderer.Component.Badge key={file} label={file} />
                            );
                        })
                    }
                </Renderer.Component.DrawerItem>
                }
                {fluxHelmChart.spec.valuesFile &&
                <Renderer.Component.DrawerItem name="Values File">
                    <Renderer.Component.Badge key={fluxHelmChart.spec.valuesFile} label={fluxHelmChart.spec.valuesFile} />
                </Renderer.Component.DrawerItem>
                }
            </div>
        )
    }
}
