import { Renderer } from "@k8slens/extensions";
import React, { ReactNode } from "react";
import {
  GitRepositoryDetails,
  FluxGitRepositoryDetailsProps
} from "./src/components/source/git-repository-details";
import {
  HelmChartDetails,
  FluxHelmChartDetailsProps
} from "./src/components/source/helm-chart-details";
import { HelmCharts } from "./src/components/source/helm-charts";
import { GitRepositories } from "./src/components/source/git-repositories";
import { GitRepository } from "./src/apis/source/git-repository";
import { HelmChart } from "./src/apis/source/helm-chart";
import { HelmRepositories } from "./src/components/source/helm-repositories";
import { HelmReleases } from "./src/components/helm/helm-releases";
import { Kustomizations } from "./src/components/kustomize/kustomizations";
import {
  FluxKustomizationDetailsProps,
  KustomizationDetails
} from "./src/components/kustomize/kustomization-details";
import { Kustomization } from "./src/apis/kustomize/kustomization";

const FluxIconSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="48.00 -2.25 262.50 364.00"><defs><style>.cls-1{fill:#fff}.cls-2{fill:none}</style></defs><path d="M178.17168 173.50075c-.1203-.01154-.2406-.0235-.36059-.03858.11991.01825.24023.0246.36059.03858zm.59967.04272a10.136 10.136 0 0 0 1.14594 0q-.57285.02673-1.14594 0zm2.10621-.0813c-.11988.01508-.24012.027-.36036.03858.1203-.01398.24054-.02033.36036-.03858zm118.08722-92.75763L184.89446 6.54433a10.18235 10.18235 0 0 0-11.10022 0L59.72393 80.70454a10.18249 10.18249 0 0 0 0 17.07392l107.61285 69.962V116.8694a6.00343 6.00343 0 0 0-6.00341-6.00342h-7.913a6.00321 6.00321 0 0 1-5.199-9.005l25.924-44.902a6.00355 6.00355 0 0 1 10.39837 0l25.92383 44.902a6.0033 6.0033 0 0 1-5.1991 9.005h-7.91278a6.00343 6.00343 0 0 0-6.00341 6.00342v50.87091l107.6125-69.96185a10.1825 10.1825 0 0 0 0-17.07392z" class="cls-1"/><path d="M173.79348 353.27108a10.12828 10.12828 0 0 0 3.45643 1.402c-2.17549-1.2312-4.38727-2.37429-6.62269-3.46036zm-6.45667-161.19546l-11.3157 7.35661a110.993 110.993 0 0 0 11.31571 6.5997zm24.01537 23.71607c9.73858 3.11505 19.81317 5.64851 30.10973 8.18655 10.92032 2.69182 21.97355 5.42717 32.81792 9.00839l-35.41606-23.02482a215.88133 215.88133 0 0 1-27.51161-9.41007zm0 62.19159v.58577c0 2.56929-2.68787 4.65195-6.00338 4.65195h-12.00855c-3.31549 0-6.00338-2.08266-6.00338-4.65195v-6.60473c-24.90538-6.40209-49.87294-14.48506-70.85945-33.8211L81.94819 247.589c22.46761 22.0509 50.27893 28.93291 79.71441 36.1886 27.17852 6.69856 55.18051 13.65144 78.68557 33.44222l14.67907-9.54334c-18.53142-16.50431-40.40962-23.68778-63.67506-29.6932zm-98.03756 22.96639l38.90829 25.29525c20.06438 5.11336 40.20029 11.24773 58.311 23.36044l14.90023-9.687c-19.7518-13.6724-42.5505-19.3134-66.41889-25.197-15.28704-3.76779-30.83479-7.6166-45.70063-13.77169zm74.02219-82.25413a124.3199 124.3199 0 0 1-21.53392-12.62006l-14.80531 9.62521a124.54057 124.54057 0 0 0 36.33923 18.708zm51.41006 16.29412c-9.1062-2.24474-18.30362-4.52388-27.39469-7.29853v13.68209q5.051 1.2853 10.17672 2.53817c29.93438 7.37818 60.8879 15.00885 85.70767 39.82861.60979.60979 1.16261 1.23989 1.752 1.85715l9.97427-6.48445a10.10425 10.10425 0 0 0 3.47529-3.79928c-1.06644-1.17252-2.144-2.34132-3.28875-3.48612-22.58513-22.5853-50.66938-29.50856-80.40251-36.83764zm-19.93295 19.93298q-3.72217-.91747-7.46168-1.85484v13.20974c25.81676 6.56181 51.80263 14.68843 73.4551 35.04069l14.52114-9.44055c-.03854-.03875-.07256-.07916-.11131-.11792-22.58546-22.58524-50.66975-29.50848-80.40325-36.83712zm-31.47711-8.58681c-16.28-5.27813-32.11777-12.39682-46.344-24.13081l-14.68176 9.5451c17.87023 15.55727 38.7844 22.67266 61.02572 28.50068z" class="cls-2"/><path d="M73.24049 254.95972c-.348-.348-.6585-.70949-.99967-1.05976l-12.51495 8.13648a10.16548 10.16548 0 0 0-1.64428 1.3968c1.05336 1.15677 2.11561 2.31024 3.24544 3.44 22.5852 22.58519 50.66968 29.50838 80.40322 36.83688 25.3425 6.24691 51.40113 12.71661 73.86454 29.60253l14.80574-9.62562c-20.86424-16.41993-45.53021-22.50891-71.45287-28.898-29.93385-7.37888-60.88738-15.00944-85.70717-39.82931z" class="cls-2"/><path d="M218.86377 209.9618l-27.51159-17.886v8.4759a215.88 215.88 0 0 0 27.51159 9.4101zm-27.51159 5.82989v11.89938c9.09108 2.77471 18.28849 5.05388 27.39469 7.29853 29.73311 7.32909 57.81738 14.25232 80.40261 36.83773 1.14474 1.14474 2.22232 2.31354 3.28875 3.48611a10.19327 10.19327 0 0 0-3.4753-13.27711l-44.6831-29.04976c-10.84437-3.58121-21.89768-6.31656-32.81794-9.00838-10.29656-2.53799-20.37113-5.07145-30.10971-8.1865zm-24.01537-9.75969a110.99292 110.99292 0 0 1-11.31571-6.59969l-10.21821 6.6432a124.31932 124.31932 0 0 0 21.53392 12.62007zm34.19212 37.87941q-5.12528-1.26352-10.17673-2.53816v11.6946q3.73686.938 7.46168 1.85485c29.73352 7.32863 57.8178 14.25187 80.40318 36.83709.03876.03876.07277.07916.11132.11792l9.66023-6.28051c-.58945-.61726-1.14225-1.24733-1.752-1.85715-24.81978-24.81979-55.7733-32.45048-85.70768-39.82864zm-34.19212-9.50272a124.54057 124.54057 0 0 1-36.33923-18.708l-10.00473 6.50436c14.22612 11.734 30.06393 18.85268 46.344 24.1308zm0 25.84203c-22.24132-5.828-43.1555-12.94341-61.02572-28.5006l-9.8338 6.39315c20.98652 19.336 45.95407 27.41893 70.85947 33.8211zm24.01537 17.73256c23.26546 6.00539 45.14367 13.18886 63.67506 29.69312l9.78-6.35823c-21.65249-20.35225-47.63835-28.47893-73.45509-35.04068zM81.94813 247.589l-9.70729 6.311c.34117.35032.65166.71178.99967 1.05976 24.81977 24.81979 55.77329 32.45043 85.70706 39.82925 25.92266 6.38909 50.58863 12.47807 71.45288 28.898l9.94772-6.46724c-23.50506-19.79078-51.507-26.74365-78.68557-33.44222-29.43548-7.25569-57.2468-14.1377-79.71447-36.18855zM61.327 266.87321c-1.12983-1.12983-2.19209-2.28328-3.24545-3.44a10.1544 10.1544 0 0 0 1.64428 15.67957l33.5887 21.83694c14.86583 6.15509 30.41359 10.0039 45.70058 13.77166 23.8684 5.88357 46.66708 11.52464 66.4189 25.197l10.1606-6.6057c-22.46332-16.88587-48.522-23.35562-73.86447-29.60253-29.73343-7.32851-57.81791-14.25175-80.40314-36.83694zm109.30024 84.33948c2.2354 1.0861 4.44718 2.22919 6.62269 3.46036a10.16012 10.16012 0 0 0 7.64543-1.402l5.63858-3.66577c-18.11065-12.11266-38.24653-18.247-58.31095-23.36044z" class="cls-1"/></svg>';

export function FluxIcon(props: Renderer.Component.IconProps) {
  return (
    <Renderer.Component.Icon {...props} svg={FluxIconSvg} tooltip="Flux" />
  );
}

export default class FluxExtension extends Renderer.LensExtension {
  clusterPages = [
    {
      id: "flux-git-repositories",
      components: {
        Page: () => <GitRepositories extension={this} />
      }
    },
    {
      id: "flux-helm-charts",
      components: {
        Page: () => <HelmCharts extension={this} />
      }
    },
    {
      id: "flux-helm-repositories",
      components: {
        Page: () => <HelmRepositories extension={this} />
      }
    },
    {
      id: "flux-helm-releases",
      components: {
        Page: () => <HelmReleases extension={this} />
      }
    },
    {
      id: "flux-kustomizations",
      components: {
        Page: () => <Kustomizations extension={this} />
      }
    }
  ];

  clusterPageMenus = [
    {
      id: "flux",
      title: "Flux",
      components: {
        Icon: FluxIcon
      }
    },
    {
      id: "flux-git-repositories",
      parentId: "flux",
      title: "Git Repositories",
      target: { pageId: "flux-git-repositories" },
      components: {
        Icon: FluxIcon
      }
    },
    {
      parentId: "flux",
      title: "Helm Charts",
      target: { pageId: "flux-helm-charts" },
      components: {
        Icon: FluxIcon
      }
    },
    {
      parentId: "flux",
      title: "Helm Repositories",
      target: { pageId: "flux-helm-repositories" },
      components: {
        Icon: FluxIcon
      }
    },
    {
      parentId: "flux",
      title: "Kustomizations",
      target: { pageId: "flux-kustomizations" },
      components: {
        Icon: FluxIcon
      }
    },
    {
      parentId: "flux",
      title: "Helm Releases",
      target: { pageId: "flux-helm-releases" },
      components: {
        Icon: FluxIcon
      }
    }
  ];

  kubeObjectDetailItems = [
    {
      kind: GitRepository.kind,
      apiVersions: ["source.toolkit.fluxcd.io/v1beta1"],
      components: {
        Details: (props: FluxGitRepositoryDetailsProps) => (
          <GitRepositoryDetails {...props} />
        )
      }
    },
    {
      kind: HelmChart.kind,
      apiVersions: ["source.toolkit.fluxcd.io/v1beta1"],
      components: {
        Details: (props: FluxHelmChartDetailsProps) => (
          <HelmChartDetails {...props} />
        )
      }
    },
    {
      kind: Kustomization.kind,
      apiVersions: ["kustomize.toolkit.fluxcd.io/v1beta1"],
      components: {
        Details: (props: FluxKustomizationDetailsProps) => (
          <KustomizationDetails {...props} />
        )
      }
    }
  ];
}
