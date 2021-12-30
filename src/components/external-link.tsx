import React from "react";
import {Common} from "@k8slens/extensions";

export class ExternalLink extends React.Component<any, any> {

    openUrl() {
        Common.Util.openExternal(this.props.url).then(() => {})
    }

    render() {
        return (
            <a href="#" onClick={Common.Util.prevDefault(() => {this.openUrl()})}>{this.props.url}</a>
        )
    }
}
