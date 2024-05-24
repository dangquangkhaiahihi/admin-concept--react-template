import React from "react";
import FolderIcon from "@material-ui/icons/Folder";
import GetAppIcon from "@material-ui/icons/GetApp";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import EditIcon from "@material-ui/icons/Edit";
import { ACTION_TYPES, DOCUMENT_TYPE } from "./utils";

export default function Toolbar(props) {
  if (props.selectedItems.length > 0) {
    return (
      <div
        className="dx-toolbar dx-widget dx-visibility-change-handler dx-collection"
        role="toolbar"
        aria-hidden="true"
        style={props.isTabletOrMobile ? {minHeight:`140px`} : {}}
      >
        <div className="dx-toolbar-items-container">
          {!props.isLock ? (
            <>
              <div className={`dx-toolbar-before ${props.isTabletOrMobile ? 'row' : ''}`}>
                {/* {props.selectedItems.length === 1 &&
              props.selectedItems[0].typeName === DOCUMENT_TYPE.FILE && (
                <div className="dx-item dx-toolbar-item dx-toolbar-button">
                  <div className="dx-item-content dx-toolbar-item-content">
                    <div
                      className="dx-button dx-button-normal dx-button-mode-text dx-widget dx-button-has-icon dx-button-has-text"
                      aria-label="Download"
                      tabIndex="0"
                      role="button"
                      onClick={() =>
                        props.handleClickOpen(ACTION_TYPES.DOWNLOAD)
                      }
                    >
                      <div className="dx-button-content">
                        <GetAppIcon className="dx-icon dx-icon-download" />
                        <span className="dx-button-text">Tải xuống</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            {props.selectedItems.length === 1 &&
              props.selectedItems[0].typeName === DOCUMENT_TYPE.FILE && (
                <div className="dx-item dx-toolbar-item dx-toolbar-button">
                  <div className="dx-item-content dx-toolbar-item-content dx-filemanager-toolbar-separator-item" />
                </div>
              )} */}
                <div className={`dx-item dx-toolbar-item dx-toolbar-button ${props.isTabletOrMobile ? 'col-6' : ''}`}>
                  <div className="dx-item-content dx-toolbar-item-content">
                    <div
                      className="dx-button dx-button-normal dx-button-mode-text dx-widget dx-button-has-icon dx-button-has-text"
                      aria-label="Move to"
                      tabIndex="0"
                      role="button"
                      onClick={() => props.handleDownloadDocument()}
                    >
                      <div className="dx-button-content">
                        <GetAppIcon className="dx-icon dx-icon-download" />
                        <span className="dx-button-text">Tải xuống</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`dx-item dx-toolbar-item dx-toolbar-button ${props.isTabletOrMobile ? 'col-6' : ''}`}>
                  <div className="dx-item-content dx-toolbar-item-content">
                    <div
                      className="dx-button dx-button-normal dx-button-mode-text dx-widget dx-button-has-icon dx-button-has-text"
                      aria-label="Move to"
                      tabIndex="0"
                      role="button"
                      onClick={() => props.handleClickOpen(ACTION_TYPES.MOVE)}
                    >
                      <div className="dx-button-content">
                        <CreateNewFolderIcon className="dx-icon dx-icon-movetofolder" />
                        <span className="dx-button-text">Di chuyển tới</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`dx-item dx-toolbar-item dx-toolbar-button ${props.isTabletOrMobile ? 'col-6' : ''}`}>
                  <div className="dx-item-content dx-toolbar-item-content">
                    <div
                      className="dx-button dx-button-normal dx-button-mode-text dx-widget dx-button-has-icon dx-button-has-text"
                      aria-label="Move to"
                      tabIndex="0"
                      role="button"
                      onClick={() => props.handleShowHideDocument(true)}
                    >
                      <div className="dx-button-content">
                        <img src={require("../../assets/icon/visibility.png")} className="pr-1 float-left" style={{ paddingTop: "2px" }} />
                        <span className="dx-button-text">Hiện tài liệu</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`dx-item dx-toolbar-item dx-toolbar-button ${props.isTabletOrMobile ? 'col-6' : ''}`}>
                  <div className="dx-item-content dx-toolbar-item-content">
                    <div
                      className="dx-button dx-button-normal dx-button-mode-text dx-widget dx-button-has-icon dx-button-has-text"
                      aria-label="Move to"
                      tabIndex="0"
                      role="button"
                      onClick={() => props.handleShowHideDocument(false)}
                    >
                      <div className="dx-button-content">
                        <img src={require("../../assets/icon/invisible.png")} className="pr-1 float-left" style={{ paddingTop: "2px" }} />
                        <span className="dx-button-text">Ẩn tài liệu</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className={`dx-item dx-toolbar-item dx-toolbar-button ${props.isTabletOrMobile ? 'col-6' : ''}`}>
              <div className="dx-item-content dx-toolbar-item-content">
                <div
                  className="dx-button dx-button-normal dx-button-mode-text dx-widget dx-button-has-icon dx-button-has-text"
                  aria-label="Copy to"
                  tabIndex="0"
                  role="button"
                  onClick={() => props.handleClickOpen(ACTION_TYPES.COPY)}
                >
                  <div className="dx-button-content">
                    <FileCopyIcon className="dx-icon dx-icon-copy" />
                    <span className="dx-button-text">Sao chép tới</span>
                  </div>
                </div>
              </div>
            </div> */}
                {props.selectedItems.length === 1 && (
                  <div className={`dx-item dx-toolbar-item dx-toolbar-button ${props.isTabletOrMobile ? 'col-6' : ''}`}>
                    <div className="dx-item-content dx-toolbar-item-content">
                      <div
                        className="dx-button dx-button-normal dx-button-mode-text dx-widget dx-button-has-icon dx-button-has-text"
                        aria-label="Rename"
                        tabIndex="0"
                        role="button"
                        onClick={() => props.handleClickOpen(ACTION_TYPES.RENAME)}
                      >
                        <div className="dx-button-content">
                          <EditIcon className="dx-icon dx-icon-rename" />
                          <span className="dx-button-text">Đổi tên</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* <div className={`dx-item dx-toolbar-item dx-toolbar-button ${props.isTabletOrMobile ? 'col-6' : ''}`}>
                  <div className="dx-item-content dx-toolbar-item-content dx-filemanager-toolbar-separator-item" />
                </div> */}
                <div className={`dx-item dx-toolbar-item dx-toolbar-button ${props.isTabletOrMobile ? 'col-6' : ''}`}>
                  <div className="dx-item-content dx-toolbar-item-content">
                    <div
                      className="dx-button dx-button-normal dx-button-mode-text dx-widget dx-button-has-icon dx-button-has-text"
                      aria-label="Delete"
                      tabIndex="0"
                      role="button"
                      onClick={() => props.handleClickOpen(ACTION_TYPES.DELETE)}
                    >
                      <div className="dx-button-content">
                        <i className="dx-icon dx-icon-trash" />
                        <span className="dx-button-text">Xóa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="dx-toolbar-center"
                style={{
                  margin: "0px 218px 0px 492px",
                  float: "none",
                }}
              />
              <div className="dx-toolbar-after" style={props.isTabletOrMobile ? {top: '105px',right: '16px'} : {}}>
                <div className={`dx-item dx-toolbar-item dx-toolbar-button ${props.isTabletOrMobile ? 'col-6' : ''}`}>
                  <div className="dx-item-content dx-toolbar-item-content">
                    <div
                      className="dx-button dx-button-normal dx-button-mode-text dx-widget dx-button-has-icon dx-button-has-text"
                      aria-label="Clear selection"
                      tabIndex="0"
                      role="button"
                      onClick={() => props.setSelectedItems([])}
                    >
                      <div className="dx-button-content">
                        <i className="dx-icon dx-icon-remove" />
                        <span className="dx-button-text">Xóa lựa chọn</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ):(
            <>
              <div className="dx-toolbar-before">
                <div className={`dx-item dx-toolbar-item dx-toolbar-button ${props.isTabletOrMobile ? 'col-6' : ''}`}>
                  <div className="dx-item-content dx-toolbar-item-content">
                    <div
                      className="dx-button dx-button-normal dx-button-mode-text dx-widget dx-button-has-icon dx-button-has-text"
                      aria-label="Move to"
                      tabIndex="0"
                      role="button"
                      onClick={() => props.handleDownloadDocument()}
                    >
                      <div className="dx-button-content">
                        <GetAppIcon className="dx-icon dx-icon-download" />
                        <span className="dx-button-text">Tải xuống</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    );
  }

  return (
    <div
      className="dx-toolbar dx-widget dx-visibility-change-handler dx-collection"
      role="toolbar"
    >
      <div className="dx-toolbar-items-container">
        <div className="dx-toolbar-before">
          <div className="dx-state-invisible dx-item dx-toolbar-item dx-toolbar-button">
            <div className="dx-item-content dx-toolbar-item-content">
              <div
                className="dx-button dx-button-normal dx-button-mode-text dx-widget dx-button-has-icon"
                aria-label="menu"
                title="Toggle navigation pane"
                tabIndex="0"
                role="button"
              >
                <div className="dx-button-content">
                  <i className="dx-icon dx-icon-menu" />
                </div>
              </div>
            </div>
          </div>
          {!props.isLock && (
            <>
              <div className="dx-item dx-toolbar-item dx-toolbar-button">
                <div className="dx-item-content dx-toolbar-item-content">
                  <div
                    className="dx-button dx-button-normal dx-button-mode-text dx-widget dx-button-has-icon dx-button-has-text"
                    aria-label="New directory"
                    tabIndex="0"
                    role="button"
                    onClick={() =>
                      props.handleClickOpen(ACTION_TYPES.CREATE_FOLDER)
                    }
                  >
                    <div className="dx-button-content">
                      <FolderIcon className="dx-icon dx-icon-newfolder" />
                      <span className="dx-button-text">Thư mục mới</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dx-item dx-toolbar-item dx-toolbar-button">
                <div className="dx-item-content dx-toolbar-item-content">
                  <div
                    className="dx-button dx-button-normal dx-button-mode-text dx-widget dx-button-has-icon dx-button-has-text"
                    aria-label="Upload files"
                    tabIndex="0"
                    role="button"
                    onClick={() => props.handleClickOpen(ACTION_TYPES.UPLOAD_FILE)}
                  >
                    <div className="dx-button-content">
                      <i className="dx-icon dx-icon-upload" />
                      <span className="dx-button-text">Tải tệp lên</span>
                    </div>
                  </div>

                  {/* <input
                id="fileInput"
                name="fileInput"
                type="file"
                className="d-none"
              /> */}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
