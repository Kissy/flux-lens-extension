import { Component, K8sApi } from "@k8slens/extensions";
import React from "react";
import { Certificate } from "../certificate";

export interface CertificateDetailsProps extends Component.KubeObjectDetailsProps<Certificate>{
}

export class CertificateDetails extends React.Component<CertificateDetailsProps> {

  render() {
    const { object: certificate } = this.props;
    if (!certificate) return null;
    return (
      <div className="Certificate">

      </div>
    )
  }
}
