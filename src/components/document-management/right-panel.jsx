/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { useForm } from "react-hook-form";
import { TextField } from "@material-ui/core";

import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

import { ContextMenu, MenuItem } from "react-contextmenu";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import DeleteIcon from "@material-ui/icons/Delete";

import {
  DOCUMENT_TYPE,
  FILE_EXTENSION_ICON,
  ACTION_TYPES,
  newGuid,
  compareValues,
} from "./utils";

const renderIcon = (type = "") => {
  if (!type) return null;

  let _type = type.toLowerCase();
  switch (_type) {
    case DOCUMENT_TYPE.FOLDER.toLowerCase():
      return (
        <img
          src={require("../../assets/icon/folder.svg")}
          alt="Folder"
          style={{ width: "16px", height: "16px" }}
        />
      );
    case FILE_EXTENSION_ICON.DOC:
      return (
        <img
          src={require("../../assets/icon/microsoft-word.svg")}
          alt="Folder"
          style={{ width: "16px", height: "16px" }}
        />
      );
    case FILE_EXTENSION_ICON.DOCX:
      return (
        <img
          src={require("../../assets/icon/microsoft-word.svg")}
          alt="Folder"
          style={{ width: "16px", height: "16px" }}
        />
      );
    case FILE_EXTENSION_ICON.PPT:
      return (
        <img
          src={require("../../assets/icon/ppt.svg")}
          alt="Folder"
          style={{ width: "16px", height: "16px" }}
        />
      );
    case FILE_EXTENSION_ICON.PDF:
      return (
        <img
          src={require("../../assets/icon/pdf.svg")}
          alt="Folder"
          style={{ width: "16px", height: "16px" }}
        />
      );
    case FILE_EXTENSION_ICON.XLSX:
      return (
        <img
          src={require("../../assets/icon/excel.svg")}
          alt="Folder"
          style={{ width: "16px", height: "16px" }}
        />
      );
    case FILE_EXTENSION_ICON.TIF:
      return (
        <img
          src={require("../../assets/icon/tif.svg")}
          alt="Folder"
          style={{ width: "16px", height: "16px" }}
        />
      );
    case FILE_EXTENSION_ICON.DWG:
      return (
        <img
          src={require("../../assets/icon/dwg.svg")}
          alt="Folder"
          style={{ width: "16px", height: "16px" }}
        />
      );
    case FILE_EXTENSION_ICON.DNG:
      return (
        <img
          src={require("../../assets/icon/paper.svg")}
          alt="Folder"
          style={{ width: "16px", height: "16px" }}
        />
      );
    case FILE_EXTENSION_ICON.JPG:
    case FILE_EXTENSION_ICON.JPEG:
    case FILE_EXTENSION_ICON.PNG:
      return (
        <img
          src={require("../../assets/icon/picture.svg")}
          alt="Folder"
          style={{ width: "16px", height: "16px" }}
        />
      );
    case FILE_EXTENSION_ICON.XLS:
      return (
        <img
          src={require("../../assets/icon/excel.svg")}
          alt="Folder"
          style={{ width: "16px", height: "16px" }}
        />
      );
    case FILE_EXTENSION_ICON.PPTX:
      return (
        <img
          src={require("../../assets/icon/pptx.svg")}
          alt="Folder"
          style={{ width: "16px", height: "16px" }}
        />
      );
    case FILE_EXTENSION_ICON.TXT:
      return (
        <img
          src={require("../../assets/icon/txt.svg")}
          alt="Folder"
          style={{ width: "16px", height: "16px" }}
        />
      );
      case FILE_EXTENSION_ICON.ZIP:
      return (
        <img
          src={require("../../assets/icon/zip.svg")}
          alt="Folder"
          style={{ width: "16px", height: "16px" }}
        />
      );
    default:
      return null;
  }
};

function RenderDataRightPanel(props) {
  const fileItems = props.fileItems || [];
  const selectedItems = props.selectedItems || [];
  const setSelectedItems = props.setSelectedItems || (() => {});
  const setSelectedFolder = props.setSelectedFolder || (() => {});
  useEffect(() => {
    props.setDocumentNumber(props.fileItems.length)
  },[props.fileItems])

  let timer = 0;
  let delay = 200;
  let prevent = false;

  const handleClick = (fileItem) => {
    if (!fileItem) return;
    timer = setTimeout(function () {
      if (!prevent) {
        doClickAction(fileItem);
      }
      prevent = false;
    }, delay);
  };

  const doClickAction = (fileItem) => {
    if (!fileItem) return;

    if (selectedItems.some((item) => item.id === fileItem.id)) {
      setSelectedItems(selectedItems.filter((item) => item.id !== fileItem.id));
    } else {
      setSelectedItems(selectedItems.concat([fileItem]));
    }
  };

  const handleDoubleClick = (fileItem) => {
    if (!fileItem) return;
    clearTimeout(timer);
    prevent = true;
    doDoubleClickAction(fileItem);
  };

  const doDoubleClickAction = (fileItem) => {
    if (!fileItem) return;
    if (fileItem.typeName === DOCUMENT_TYPE.FOLDER) {
      setSelectedFolder(fileItem);
      props.onGetAllDocumentByParentId(fileItem.id);
    } else {
      let file = {
        id: fileItem.id,
        extension:
          (fileItem.fileExtension && fileItem.fileExtension.name) || "",
        path: fileItem.path,
      };
      props.handleClickOpen(ACTION_TYPES.PREVIEW_FILE, file);
    }
  };

  return (
    <table
      className="dx-datagrid-table dx-datagrid-table-fixed dx-select-checkboxes-hidden"
      style={{ tableLayout: "fixed" }}
    >
      <tbody>
        {fileItems.map((fileItem) => (
          <tr
            className={`dx-row dx-data-row ${
              selectedItems.some((item) => item.id === fileItem.id) &&
              "dx-row-focused dx-selection"
            }`}
            key={newGuid()}
            onClick={() => handleClick(fileItem)}
            onDoubleClick={() => handleDoubleClick(fileItem)}
          >
            <td className="dx-command-select dx-editor-cell dx-editor-inline-block text-center">
              <div
                className={`dx-select-checkbox dx-datagrid-checkbox-size dx-show-invalid-badge dx-checkbox dx-widget ${
                  selectedItems.some((item) => item.id === fileItem.id) &&
                  "dx-checkbox-checked"
                }`}
              >
                <div className="dx-checkbox-container">
                  <span className="dx-checkbox-icon" />
                </div>
              </div>
            </td>

            <td className="text-center dx-documentmanagement-typeName">
              {renderIcon(
                (fileItem.fileExtension && fileItem.fileExtension.name) ||
                  fileItem.typeName
              )}
            </td>

            <td className="text-left dx-documentmanagement-name">
              <div className="dx-filemanager-details-item-name-wrapper">
                <span className="dx-filemanager-details-item-name">
                  {fileItem.name}
                </span>
              </div>
            </td>

            <td className="text-left dx-documentmanagement-modifiedDate">
              {fileItem.modifiedDate &&
                moment(fileItem.modifiedDate).format("DD/MM/YYYY")}
            </td>

            <td className="text-left dx-documentmanagement-status">
              {fileItem.isActive ? "Hiện" : "Ẩn"}
            </td>

            <td className="dx-last-data-cell text-left dx-documentmanagement-fileSize">
              {fileItem.typeName &&
                fileItem.typeName === DOCUMENT_TYPE.FILE &&
                `${fileItem.fileSize} KB`}
            </td>

            {/* <td className="dx-command-adaptive dx-command-adaptive-hidden text-center">
              {fileItem.typeName !== DOCUMENT_TYPE.FOLDER && (
                <span className="dx-datagrid-adaptive-more" />
              )}
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const OptionRightMouse = (
  onCreateFolder,
  onUploadFile,
  onRenameDocument,
  onDeleteDocument
) => {
  return (
    <ContextMenu id={`treeLevel`}>
      <MenuItem onClick={onCreateFolder}>
        <CreateNewFolderIcon className="mr-2" /> Thư mục mới
      </MenuItem>
      <MenuItem onClick={onUploadFile}>
        <InsertDriveFileIcon className="mr-2" /> Thêm file
      </MenuItem>
      <MenuItem onClick={onRenameDocument}>
        <BorderColorIcon className="mr-2" /> Đổi tên
      </MenuItem>
      <MenuItem onClick={onDeleteDocument}>
        <DeleteIcon className="mr-2" /> Xóa
      </MenuItem>
      <MenuItem divider />
    </ContextMenu>
  );
};

export default function RightPanel(props) {
  const { register, handleSubmit } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });
  
  const [scrollPosition, setScrollPosition] = useState(0);
  const tableHeader = useRef(null);
  const tableContent = useRef(null);

  const handleScrollTableForContent = (event) => {
    tableHeader.current.scrollLeft = event.target.scrollLeft;
  };

  const _fileItems = props.fileItems || [];
  const selectedItems = props.selectedItems || [];
  const setSelectedItems = props.setSelectedItems || (() => {});
  const selectedFolder = props.selectedFolder || null;
  const setSelectedFolder = props.setSelectedFolder || (() => {});
  const selectedFolderList = props.selectedFolderList || [];

  const [folderItems, setFolderItems] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  useEffect(() => {
    if (props.isSearch) {
      setFolderItems(_fileItems);
    } else {
      if (selectedFolder && selectedFolder instanceof Object) {
        getItemsInFolder(_fileItems);
      } else {
        setFolderItems([]);
      }
    }
  }, [_fileItems, selectedFolder]);

  useEffect(() => {
    let formSearch = document.getElementById("formSearchDocument");
    if (!props.isSearch && formSearch) formSearch.reset();
  }, [props.isSearch]);

  useEffect(() => {
    if (
      props.selectedFolderList &&
      props.selectedFolderList.length === 1 &&
      props.selectedFolderList[props.selectedFolderList.length - 1].id !== -1
    ) {
      setSelectedFolder(selectedFolderList[selectedFolderList.length - 1]);
    }
  }, [props.selectedFolderList]);

  const getItemsInFolder = (array) => {
    array.forEach((item) => {
      if (item.id === props.selectedFolder.id) {
        setFolderItems((item.items || []).sort(compareValues(orderBy, order)));
      } else {
        getItemsInFolder(item.items || []);
      }
    });
  };

  const sortColumn = (_orderBy = orderBy, _order = order) => {
    let _orderResult = _order === "asc" ? "desc" : "asc";
    setOrder(_orderResult);
    setOrderBy(_orderBy);
    setFolderItems(folderItems.sort(compareValues(_orderBy, _orderResult)));
  };

  const selectAllItems = () => {
    if (selectedItems.length === folderItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(folderItems);
    }
  };

  const backFolder = () => {
    if (selectedFolderList.length > 1) {
      setSelectedFolder(selectedFolderList[selectedFolderList.length - 2]);
    } else {
      setSelectedFolder(selectedFolderList[0]);
    }
  };

  let timer = 0;
  let delay = 500;
  const onChangeSearch = (_data = "") => {
    clearTimeout(timer);
    timer = setTimeout(function () {
      if (props.isSearch && !_data) {
        props.onGetAllDocumentByParentId(
          selectedFolder.id,
          false,
          props.selectedFolderTemp
        );
        return;
      }
      let params = {
        parentId: selectedFolder.id === -1 ? 0 : selectedFolder.id,
        fileName: _data,
      };
      if (props.selectedFolderTemp) {
        params = {
          ...params,
          parentId:
            props.selectedFolderTemp.id === -1
              ? 0
              : props.selectedFolderTemp.id,
        };
      }

      props.onSearchFile(params);
    }, delay);
  };

  const onSearch = (data) => {
    if (!data || !data.search) {
      props.onGetAllDocumentByParentId(
        selectedFolder.id,
        false,
        props.selectedFolderTemp
      );
      setSelectedFolder(props.selectedFolderTemp);
      return;
    }

    let params = {
      parentId: selectedFolder.id === -1 ? 0 : selectedFolder.id,
      fileName: data.search,
    };

    if (props.selectedFolderTemp) {
      params = {
        ...params,
        parentId:
          props.selectedFolderTemp.id === -1 ? 0 : props.selectedFolderTemp.id,
      };
    }

    props.onSearchFile(params);
  };

  const renderIconSort = (_orderBy = "") => {
    if (orderBy !== _orderBy) return "dx-sort dx-sort-none";

    return `dx-sort dx-sort-${order === "desc" ? "down" : "up"}`;
  };
  return (
    <div className="dx-drawer-content">
      <div className="dx-filemanager-adaptivity-drawer-panel">
        <div className="dx-filemanager-items-panel">
          <div className="dx-widget dx-filemanager-breadcrumbs">
            <div className={`dx-menu dx-widget dx-visibility-change-handler dx-collection dx-menu-base ${props.isTabletOrMobile && 'row'}`}>
              <div className={`dx-menu-horizontal ${props.isTabletOrMobile && 'col-12'}`} style={props.isTabletOrMobile ? {border:'solid 0.8px', borderColor: '#ddd',backgroundColor:'#fff'} : { width: "70%" }}>
                <ul
                  className="dx-menu-items-container"
                  style={{ width: "100%", overflowX: "auto" }}
                >
                  <li className="dx-menu-item-wrapper" onClick={backFolder}>
                    <div className="dx-item dx-menu-item dx-menu-item-has-icon dx-filemanager-breadcrumbs-parent-folder-item">
                      <div className="dx-item-content dx-menu-item-content">
                        <i className="dx-icon dx-icon-arrowup" />
                      </div>
                    </div>
                  </li>
                  <li className="dx-menu-item-wrapper">
                    <div className="dx-item dx-menu-item dx-menu-item-has-text dx-filemanager-breadcrumbs-separator-item">
                      <div className="dx-item-content dx-menu-item-content">
                        <span className="dx-menu-item-text">&nbsp;</span>
                      </div>
                    </div>
                  </li>
                  {selectedFolderList.map((folder, index) => (
                    <span key={newGuid()}>
                      {index !== 0 && (
                        <li
                          className="dx-menu-item-wrapper"
                          onClick={() => setSelectedFolder(folder)}
                        >
                          <div className="dx-item dx-menu-item dx-menu-item-has-icon dx-filemanager-breadcrumbs-path-separator-item">
                            <div className="dx-item-content dx-menu-item-content">
                              <i className="dx-icon dx-icon-spinnext"></i>
                            </div>
                          </div>
                        </li>
                      )}
                      <li
                        className="dx-menu-item-wrapper"
                        onClick={() => setSelectedFolder(folder)}
                      >
                        <div className="dx-item dx-menu-item dx-menu-item-has-text">
                          <div className="dx-item-content dx-menu-item-content">
                            <span className="dx-menu-item-text">
                              {folder.name}
                            </span>
                          </div>
                        </div>
                      </li>
                    </span>
                  ))}
                </ul>
              </div>
              <div className={`dx-menu-search ${props.isTabletOrMobile && 'col-12'}`} style={props.isTabletOrMobile ? {position: 'static',backgroundColor:'#fff',border:'solid 0.8px', borderColor: '#ddd'} : {}}>
                {selectedFolder && (
                  <form
                    id="formSearchDocument"
                    onSubmit={handleSubmit(onSearch)}
                  >
                    <TextField
                      size="small"
                      type="search"
                      name="search"
                      placeholder={`Tìm ${selectedFolder.name}...`}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      inputRef={register()}
                      onChange={(e) => onChangeSearch(e.target.value)}
                    />
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="dx-filemanager-details dx-filemanager-files-view dx-widget">
            <div className="dx-widget dx-visibility-change-handler">
              <div className="dx-datagrid dx-gridbase-container">
                <div className="dx-datagrid-headers dx-datagrid-nowrap">
                  <div className="dx-datagrid-content dx-datagrid-scroll-container" ref={tableHeader}>
                    <table className="dx-datagrid-table dx-datagrid-table-fixed">
                      <tbody>
                        <tr className="dx-row dx-header-row">
                          <th
                            className="dx-command-select dx-editor-cell dx-editor-inline-block text-center"
                            onClick={selectAllItems}
                          >
                            <div
                              className={`dx-select-checkbox dx-datagrid-checkbox-size dx-show-invalid-badge dx-checkbox dx-widget ${
                                folderItems.length > 0 &&
                                props.selectedItems.length ===
                                  folderItems.length &&
                                "dx-checkbox-checked"
                              }`}
                              role="checkbox"
                              aria-checked="false"
                            >
                              <div className="dx-checkbox-container">
                                <span className="dx-checkbox-icon"></span>
                              </div>
                            </div>
                          </th>

                          <th
                            className="dx-filemanager-details-item-is-directory dx-datagrid-action text-center"
                            onClick={() => sortColumn("typeName")}
                          >
                            <div className="dx-column-indicators dx-visibility-hidden">
                              <span className="dx-sort dx-sort-none" />
                            </div>
                            <div className="dx-datagrid-text-content dx-text-content-alignment-left dx-text-content-alignment-right" />
                            <div className="dx-column-indicators">
                              <span className="dx-sort dx-sort-none" />
                            </div>
                          </th>

                          <th
                            className="dx-datagrid-action text-left dx-documentmanagement-name"
                            onClick={() => sortColumn("name")}
                          >
                            <div className="dx-datagrid-text-content dx-text-content-alignment-left">
                              Tên
                            </div>
                            <div className="dx-column-indicators">
                              <span className={renderIconSort("name")} />
                            </div>
                          </th>

                          <th
                            className="dx-datagrid-action text-left dx-documentmanagement-modifiedDate"
                            onClick={() => sortColumn("modifiedDate")}
                          >
                            <div className="dx-datagrid-text-content dx-text-content-alignment-left">
                              Ngày sửa
                            </div>
                            <div className="dx-column-indicators">
                              <span
                                className={renderIconSort("modifiedDate")}
                              />
                            </div>
                          </th>

                          <th className="dx-datagrid-action text-left dx-documentmanagement-status">
                            <div className="dx-datagrid-text-content dx-text-content-alignment-left">
                              Trạng thái
                            </div>
                            <div className="dx-column-indicators">
                              <span className={renderIconSort("status")} />
                            </div>
                          </th>

                          <th
                            className="dx-datagrid-action text-left dx-documentmanagement-fileSize"
                            onClick={() => sortColumn("fileSize")}
                          >
                            <div className="dx-column-indicators">
                              <span className={renderIconSort("fileSize")} />
                            </div>
                            <div className="dx-datagrid-text-content dx-text-content-alignment-right dx-sort-indicator">
                              Kích thước
                            </div>
                          </th>

                          {/* <th className="dx-command-adaptive dx-command-adaptive-hidden text-center">
                            &nbsp;
                          </th> */}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="dx-datagrid-rowsview dx-datagrid-nowrap dx-scrollable dx-visibility-change-handler dx-scrollable-both dx-scrollable-simulated">
                  <div className="dx-scrollable-wrapper hide-scrollbar" ref={tableContent} style={{msOverflowStyle: 'none', scrollbarWidth: 'none'}} onScroll={handleScrollTableForContent}>
                    <div className="dx-scrollable-container">
                      <div className="dx-scrollable-content">
                        <div className="dx-datagrid-content">
                          <RenderDataRightPanel
                            {...props}
                            fileItems={folderItems}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {folderItems.length === 0 && (
                    <span className="dx-datagrid-nodata">
                      {props.isSearch
                        ? "Không có bản ghi nào phù hợp"
                        : "Thư mục này trống"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
