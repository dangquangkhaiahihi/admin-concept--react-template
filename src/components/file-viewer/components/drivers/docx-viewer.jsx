// Copyright (c) 2017 PlanGrid, Inc.

import React, { Component } from "react";
import mammoth from "mammoth";

import "../../styles/docx.scss";

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      percent: 0,
    };
  }

  componentDidMount() {
    const jsonFile = new XMLHttpRequest();
    jsonFile.upload.addEventListener(
      "progress",
      this.progressCallback.bind(this)
    );
    jsonFile.addEventListener("progress", this.progressCallback.bind(this));
    jsonFile.open("GET", this.props.filePath, true);
    jsonFile.send();
    jsonFile.responseType = "arraybuffer";
    jsonFile.onreadystatechange = () => {
      if (jsonFile.readyState === 4 && jsonFile.status === 200) {
        mammoth
          .convertToHtml(
            { arrayBuffer: jsonFile.response },
            { includeDefaultStyleMap: true }
          )
          .then((result) => {
            const docEl = document.createElement("div");
            docEl.className = "document-container";
            docEl.innerHTML = result.value;
            document.getElementById("docx").innerHTML = docEl.outerHTML;
          })
          .catch((a) => {
            console.log("alexei: something went wrong", a);
          })
          .done();
      }
    };
  }

  progressCallback(progress) {
    let percent = (progress.loaded / progress.total) * 100;
    percent = (percent > 89 ? 89 : percent).toFixed();
    this.setState({ percent });
  }

  renderLoading() {
    return <div className="pdf-loading">LOADING ({this.state.percent}%)</div>;
  }

  render() {
    return <div id="docx">{this.renderLoading()}</div>;
  }
}
