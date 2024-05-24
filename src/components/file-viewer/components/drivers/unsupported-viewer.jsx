/* eslint-disable jsx-a11y/anchor-is-valid */
// Copyright (c) 2017 PlanGrid, Inc.

import React from "react";
import { saveAs } from "file-saver";

import * as documentAction from "../../../../redux/store/document/document.store";

import "../../styles/unsupported.scss";

const downloadFileBinary = (id, name) => {
  if (!id || !name) return;
  documentAction.DownloadFile(id).then((res) => {
    const blob = new Blob([res], {
      type: "application/*",
    });
    let _nameArray = name.split("/");
    saveAs(blob, _nameArray[_nameArray.length - 1]);
  });
};

const UnsupportedViewer = (props) => (
  <div className="pg-driver-view">
    <div className="unsupported-message">
      {props.unsupportedComponent ? (
        <props.unsupportedComponent {...props} />
      ) : (
        <div>
          <p className="alert">
            Không hỗ trợ hiển thị file <b>{`.${props.fileType}`}</b>. Bạn có
            muốn download file? (
            <a
              className="cursor-pointer"
              onClick={() => downloadFileBinary(props.fileId, props.filePath)}
            >
              click để download
            </a>
            )
          </p>
        </div>
      )}
    </div>
  </div>
);

export default UnsupportedViewer;
