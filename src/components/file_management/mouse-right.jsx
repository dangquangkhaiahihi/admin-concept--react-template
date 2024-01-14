import React, { useState, useEffect } from "react";
import FolderIcon from "@material-ui/icons/Folder";
import FileCopyIcon from "@material-ui/icons/FileCopy";

export default function MouseRight(props) {
  let option = "";
  if (option) {
    return (
      <div className="dx-widget">
        <div className="dx-has-context-menu dx-widget dx-visibility-change-handler dx-collection dx-filemanager-context-menu">
          <div className="dx-overlay dx-widget dx-visibility-change-handler dx-state-invisible">
            <div
              className="dx-overlay-content dx-inner-overlay dx-resizable dx-context-menu dx-filemanager-context-menu dx-menu-base dx-state-invisible"
              tabIndex="0"
              role="menu"
              style={{
                width: "auto",
                height: "auto",
                zIndex: 1502,
                margin: "0px",
                left: "0px",
                top: "0px",
                transform: "translate(0px, 0px)",
                transition: "none 0s ease 0s",
                visibility: "visible",
                opacity: 0,
              }}
              aria-hidden="true"
            >
              <div className="dx-submenu" style={{ visibility: "visible" }}>
                <ul role="none" className="dx-menu-items-container">
                  <li role="none" className="dx-menu-item-wrapper">
                    <div
                      className="dx-item dx-menu-item dx-menu-item-has-text dx-menu-item-has-icon"
                      role="menuitem"
                      tabIndex="-1"
                    >
                      <div className="dx-item-content dx-menu-item-content">
                        <i className="dx-icon dx-icon-rename" />
                        <span className="dx-menu-item-text">Rename</span>
                      </div>
                    </div>
                  </li>
                  <li role="none" className="dx-menu-item-wrapper">
                    <div
                      className="dx-item dx-menu-item dx-menu-item-has-text dx-menu-item-has-icon"
                      role="menuitem"
                      tabIndex="-1"
                    >
                      <div className="dx-item-content dx-menu-item-content">
                        <i className="dx-icon dx-icon-movetofolder" />
                        <span className="dx-menu-item-text">Move to</span>
                      </div>
                    </div>
                  </li>
                  <li role="none" className="dx-menu-item-wrapper">
                    <div
                      className="dx-item dx-menu-item dx-menu-item-has-text dx-menu-item-has-icon"
                      role="menuitem"
                      tabIndex="-1"
                    >
                      <div className="dx-item-content dx-menu-item-content">
                        <FileCopyIcon className="dx-icon dx-icon-copy" />
                        <span className="dx-menu-item-text">Copy to</span>
                      </div>
                    </div>
                  </li>
                  <li
                    role="none"
                    className="dx-menu-item-wrapper dx-menu-last-group-item"
                  >
                    <div
                      className="dx-item dx-menu-item dx-menu-item-has-text dx-menu-item-has-icon"
                      role="menuitem"
                      tabIndex="-1"
                    >
                      <div className="dx-item-content dx-menu-item-content">
                        <i className="dx-icon dx-icon-trash" />
                        <span className="dx-menu-item-text">Delete</span>
                      </div>
                    </div>
                  </li>
                  <li className="dx-menu-separator" />
                  <li role="none" className="dx-menu-item-wrapper">
                    <div
                      className="dx-item dx-menu-item dx-menu-item-has-text dx-menu-item-has-icon"
                      role="menuitem"
                      tabIndex="-1"
                    >
                      <div className="dx-item-content dx-menu-item-content">
                        <i className="dx-icon dx-filemanager-i dx-filemanager-i-refresh" />
                        <span className="dx-menu-item-text">Refresh</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="dx-widget">
      <div
        className="dx-has-context-menu dx-widget dx-visibility-change-handler dx-collection dx-filemanager-context-menu"
        aria-owns="dx-6338926d-08ce-7c6e-c04b-8fe86e1981a8"
      >
        <div className="dx-overlay dx-widget dx-visibility-change-handler">
          <div
            className="dx-overlay-content dx-inner-overlay dx-resizable dx-context-menu dx-filemanager-context-menu dx-menu-base"
            tabIndex="0"
            id="dx-6338926d-08ce-7c6e-c04b-8fe86e1981a8"
            role="menu"
            style={{
              width: "auto",
              height: "auto",
              zIndex: 1502,
              margin: "0px",
              left: "0px",
              top: "0px",
              transform: "translate(75px, 6px)",
              transition: "none 0s ease 0s",
            }}
            aria-hidden="true"
          >
            <div className="dx-submenu">
              <ul role="none" className="dx-menu-items-container">
                <li role="none" className="dx-menu-item-wrapper">
                  <div
                    className="dx-item dx-menu-item dx-menu-item-has-text dx-menu-item-has-icon"
                    role="menuitem"
                    tabIndex="-1"
                  >
                    <div className="dx-item-content dx-menu-item-content">
                      <i className="dx-icon dx-icon-newfolder" />
                      <span className="dx-menu-item-text">New directory</span>
                    </div>
                  </div>
                </li>
                <li
                  role="none"
                  className="dx-menu-item-wrapper dx-menu-last-group-item"
                >
                  <div
                    className="dx-item dx-menu-item dx-menu-item-has-text dx-menu-item-has-icon"
                    role="menuitem"
                    tabIndex="-1"
                  >
                    <div className="dx-item-content dx-menu-item-content">
                      <i className="dx-icon dx-icon-upload" />
                      <span className="dx-menu-item-text">Upload files</span>
                    </div>
                  </div>
                </li>
                <li className="dx-menu-separator" />
                <li role="none" className="dx-menu-item-wrapper">
                  <div
                    className="dx-item dx-menu-item dx-menu-item-has-text dx-menu-item-has-icon"
                    role="menuitem"
                    tabIndex="-1"
                  >
                    <div className="dx-item-content dx-menu-item-content">
                      <i className="dx-icon dx-filemanager-i dx-filemanager-i-refresh" />
                      <span className="dx-menu-item-text">Refresh</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
