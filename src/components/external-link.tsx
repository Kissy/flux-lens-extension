import React from "react";
import { Common } from "@k8slens/extensions";

export class ExternalLink extends React.Component<any, any> {
  render() {
    return (
      <a
        href="#"
        onClick={Common.Util.prevDefault(() => {
          Common.Util.openExternal(this.props.url);
        })}
      >
        {this.props.url}
      </a>
    );
  }
}
