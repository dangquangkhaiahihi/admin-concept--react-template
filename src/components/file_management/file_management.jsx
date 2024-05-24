/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as appActions from "../../core/app.store";
import * as documentRepositoryAction from "../../redux/store/document-repository/document-repository.store";
import * as documentStore from '../../redux/store/document/document-management.store';

import FileInputComponent from "../../components/file-input/file-input.view";
import FileViewer from "../../components/file-viewer/components/file-viewer";
import ShowNotification from "../../components/react-notifications/react-notifications";
import LoaddingProgress from "../../components/loading/loading-progress.view";
import {
  NotificationMessageType,
  APIUrlDefault,
} from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";
import * as configCommon from "../../common/config";

import LeftPanel from "./left-panel";
import RightPanel from "./right-panel";
import Dialog from "./dialog";
import Toolbar from "./toolbar";
import {
  ACTION_TYPES,
  FILE_EXTENSION,
  DOCUMENT_TYPE,
  DefaultData,
  DefaultDataSearch,
  maxWidthDialog,
  isValidFileSelect,
} from "./utils";

import "./dx.common.css";
import "./dx.light.css";
import "./file-management.scss";
import { saveAs } from "file-saver";
import { useMediaQuery } from "react-responsive";

function FileManagement(props) {

  //media query
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  const files = props.files || [];
  const isShowUi = props.isShowUi;
  const setFiles = props.setFiles || (() => { });
  const isShowLeft = (props.isShowLeft === undefined ? true : props.isShowLeft);
  const _defaultFolderId = props.cgisId || null
  // const _defaultFolderId = localStorage.getItem('cgisId') || null;
  const typeFile = (props.typeFile === undefined ? null : props.typeFile);

  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFolderTemp, setSelectedFolderTemp] = useState(null);
  const [selectedFolderList, setSelectedFolderList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [fileItems, setFileItems] = useState(DefaultData);
  const [fileItemsSearch, setFileItemsSearch] = useState([]);
  const [fileItemsTemp, setFileItemsTemp] = useState(DefaultData);
  const [fileUpload, setFileUpload] = useState([]);

  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState("");

  const [filePreview, setFilePreview] = useState(null);
  const [filesTemp, setFilesTemp] = useState(null);

  const [progressValue, setProgressValue] = useState(-1);
  const [districtId, setDistrictId] = useState();

  useEffect(() => {
    const _pId = !!typeFile ? _defaultFolderId : 0;
    onGetAllDocumentByParentId(_pId, true, typeFile);
          props.GetLookupDistrict();
  }, []);

  useEffect(() => {
    let _dList = [];
    if (typeFile) {
      props.documentList.forEach(_doc => {
        _doc.parentId = 0;
        _dList.push(_doc);
      });
    } else {
      _dList = props.documentList
    }
    changeDataDocumentList(_dList);
  }, [props.documentList]);

  useEffect(() => {
    let _arrayResult = (props.documentSearch || []).filter(
      (file) => file.typeName === DOCUMENT_TYPE.FILE
    );
    changeDataDocumentList(_arrayResult);
  }, [props.documentSearch]);

  useEffect(() => {
    if (props.multiple) {
      if (selectedItems.length === 0) {
        setFiles(filesTemp);
        return;
      }
      !filesTemp && setFilesTemp(files);
      let _selectedItems = selectedItems.filter(
        (item) => isValidFileSelect(item, props.acceptedFiles) === true
      );
     
      if (_selectedItems.length > 0) {     
        var _file = _selectedItems.map(item => ({ fileId: item.id, fileName: item.name, filePreview: item.path }));
        setFiles(_file);
      } else {
        setFiles(files);
      }
      return;
    } else {
      if (selectedItems.length > 1 || selectedItems.length === 0) {
        setFiles(filesTemp);
        return;
      }
      !filesTemp && setFilesTemp(files);
      let _selectedItems = selectedItems.filter(
        (item) => isValidFileSelect(item, props.acceptedFiles) === true
      );
      if (_selectedItems.length > 0) {
        let _file = {
          fileId: _selectedItems[0].id,
          fileName: _selectedItems[0].name,
          filePreview: _selectedItems[0].path,
        };
        setFiles([_file]);
      } else {
        setFiles(files);
      }
    }
  }, [selectedItems]);

  const onGetAllDocumentByParentId = (parentId = 0, firstLoad = false, type = null, _selectedFolder = null) => {
    props.showLoading(true);
    let _parentId = parentId;
    if (_selectedFolder) {
      _parentId = selectedFolderTemp.id;
    };
    if (_defaultFolderId) {
      _parentId = parentId
    }
    props.onGetAllDocumentByParentId(_parentId === -1 ? 0 : parentId, type, isShowUi).then(
      (res) => {
        if (firstLoad) {
          if (type) {
            setSelectedFolder(DefaultData[1]);
            setSelectedFolderList([DefaultData[1]]);
          } else {
            setSelectedFolder(DefaultData[0]);
            setSelectedFolderList([DefaultData[0]]);
          }
        } else if (_selectedFolder) {
          setSelectedFolder(selectedFolderTemp);
          setSelectedFolderList([selectedFolderTemp]);
          setSelectedFolderTemp(null);
        }
        props.showLoading(false);
      },
      () => {
        props.showLoading(false);
      }
    );
  };

  const onSearchFile = (data, callBack = null) => {
    if (!data) return;
    !selectedFolderTemp && setSelectedFolderTemp(selectedFolder);
    props.showLoading(true);
    props.onDocumentRepositorySearchDocument(data).then(
      (res) => {
        callBack && callBack();
        setSelectedFolder(DefaultDataSearch[0]);
        setSelectedFolderList([DefaultDataSearch[0]]);
        props.showLoading(false);
      },
      () => {
        props.showLoading(false);
      }
    );
  };

  const changeDataDocumentList = (_documentList = []) => {
    let _fileItems = [];
    let _arrayResult = [];

    if (props.isSearch) {
      _fileItems = _documentList;
      setFileItemsSearch(_fileItems);
      return;
    } else if (actionType === ACTION_TYPES.MOVE) {
      _fileItems = fileItemsTemp;
    } else {
      _fileItems = fileItems;
    }

    if (_documentList.length === 0) {
      const items = convertDataDocuments(
        _fileItems[0].items,
        _documentList,
        selectedFolder
      );
      _arrayResult = [
        {
          ..._fileItems[0],
          items: items,
        },
      ];
      setFileItems(_arrayResult);
      return;
    }

    if (_documentList[0].parentId === 0) {
      const items = _documentList.map((document) => {
        return {
          ...document,
          pathIds: _fileItems[0].pathIds.concat([document.id]),
          isOpen: false,
        };
      });
      _arrayResult = [
        {
          ..._fileItems[0],
          hasChild: items.length > 0,
          items: items,
        },
      ];
    } else {
      const items = convertDataDocuments(_fileItems[0].items, _documentList);
      _arrayResult = [
        {
          ..._fileItems[0],
          items: items,
        },
      ];
    }

    if (actionType === ACTION_TYPES.MOVE) {
      setFileItemsTemp(_arrayResult);
    } else {
      setFileItems(_arrayResult);
    }
  };

  const convertDataDocuments = (
    _arrayResult,
    _documentList,
    _selectedFolderTemp = null
  ) => {
    const idCheck = _selectedFolderTemp
      ? _selectedFolderTemp.id
      : _documentList.length > 0
        ? _documentList[0].parentId
        : 0;

    return _arrayResult.map((item) => {
      if (item.id === idCheck) {
        return {
          ...item,
          items: _documentList.map((document) => {
            return {
              ...document,
              pathIds: item.pathIds.concat([document.id]),
              isOpen: false,
            };
          }),
        };
      } else {
        const items = item.items || [];
        if (items.length > 0) {
          return {
            ...item,
            items: convertDataDocuments(
              items,
              _documentList,
              _selectedFolderTemp
            ),
          };
        } else {
          return {
            ...item,
            items: [],
          };
        }
      }
    });
  };

  const handleClickOpen = (type = "", file = null) => {
    setActionType(type);
    setOpen(true);
    setFilePreview(file);
  };

  const handleClose = () => {
    setActionType("");
    setSelectedFolderTemp(null);
    setFileItemsTemp(DefaultData);
    setOpen(false);
  };

  const onCreateFolder = (
    folderName = "",
    folderItem = null,
    callBack = null
  ) => {
    if (!folderName || !folderItem) return;

    props.showLoading(true);
    let params = {
      parentId: folderItem.id === -1 ? 0 : folderItem.id,
      targetPath: folderItem.id < 1 ? "" : folderItem.path,
        folderName: folderName,
        showUI:  isShowUi ? 1 : 0,
    };
    documentRepositoryAction
      .DocumentRepositoryCreateFolder(params)
      .then(
        (res) => {
          callBack && callBack();
          props.showLoading(false);
          ShowNotification(
            "Tạo thư mục thành công",
            NotificationMessageType.Success
          );
          onGetAllDocumentByParentId(folderItem.id === -1 ? 0 : folderItem.id);
        },
        (err) => {
          props.showLoading(false);
          let mess =
            viVN.Errors[(err && err.errorType) || "UnableHandleException"];
          if (err && err.errorType === "FileExisted") {
            mess = err.errorMessage;
          }
          ShowNotification(mess, NotificationMessageType.Error);
        }
      )
      .catch((err) => {
        props.showLoading(false);
        let mess = viVN.Errors("UnableHandleException");
        ShowNotification(mess, NotificationMessageType.Error);
      });
  };

    const handleChooseDistrict = (event) => {
        setDistrictId(event.target.value);
    }
  const onUploadFile = (fileList = [], folderItem = null, callBack = null) => {
    if (fileList.length === 0 || !folderItem) return;

    const _parentId = _defaultFolderId && _defaultFolderId !== 0 ? _defaultFolderId : folderItem.id === -1 ? 0 : folderItem.id;
    const _uploadFolderPath = _defaultFolderId && _defaultFolderId !== 0 ? 'Uploads\\cgis' : folderItem.id < 1 ? "" : folderItem.path;

    props.showLoading(true);
    let params = {
      parentId: _parentId,
      uploadFolderPath: _uploadFolderPath,
      uploadFile: fileList,
              districtId: districtId,
      showUi: isShowUi ? 1 : 0,
    };
    documentRepositoryAction
      .DocumentRepositoryUploadDocument(params)
      .then(
        (res) => {
          callBack && callBack();
          props.showLoading(false);
          ShowNotification(
            "Tải tệp lên thành công",
            NotificationMessageType.Success
          );
          onGetAllDocumentByParentId(_parentId);
        },
        (err) => {
          props.showLoading(false);
          let mess =
            viVN.Errors[(err && err.errorType) || "UnableHandleException"];
          if (err && err.errorType === "FileExisted") {
            mess = err.errorMessage;
          }
          ShowNotification(mess, NotificationMessageType.Error);
        }
      )
      .catch((err) => {
        props.showLoading(false);
        let mess = viVN.Errors("UnableHandleException");
        ShowNotification(mess, NotificationMessageType.Error);
      });
  };

  const onDownloadDocument = () => {
    if (selectedItems.length === 0) return;
    props.showLoading(true);
    let listPaths = selectedItems.map((item) => {
      return { filePath: item.path }
    })
    setProgressValue(0);
    documentRepositoryAction.DocumentRepositoryDownloadDocument(listPaths, setProgressValue).then(res => {
      if (res) {
        const blob = new Blob([res], {
          type: "application/*",
        });
        saveAs(blob, "download.zip");
      }
      setProgressValue(-1)
      props.showLoading(false);
    }, (err) => {
      ShowNotification(
        viVN.Errors[(err && err.errorType) || "UnableHandleException"],
        NotificationMessageType.Error
      );
      setProgressValue(-1)
      props.showLoading(false);
    }).catch((err) => {
      setProgressValue(-1)
      props.showLoading(false);
      ShowNotification(
        viVN.Errors[(err && err.errorType) || "UnableHandleException"],
        NotificationMessageType.Error
      );
    })

  }

  const onRenameDocument = (data, folderItem = null, callBack = null) => {
    if (!data || !folderItem) return;

    props.showLoading(true);
    let params = {
      documentId: data.documentId,
        newFileName: data.newFileName,
        districtId: data.districtId,
      title: data.title,
      };
      
    documentRepositoryAction
      .DocumentRepositoryRenameDocument(params)
      .then(
        (res) => {
          callBack && callBack();
          props.showLoading(false);
          ShowNotification(
            "Đổi tên thành công",
            NotificationMessageType.Success
          );
          onGetAllDocumentByParentId(folderItem.id === -1 ? 0 : folderItem.id);
        },
        (err) => {
          props.showLoading(false);
          let mess =
            viVN.Errors[(err && err.errorType) || "UnableHandleException"];
          if (err && err.errorType === "FileExisted") {
            mess = err.errorMessage;
          }
          ShowNotification(mess, NotificationMessageType.Error);
        }
      )
      .catch((err) => {
        props.showLoading(false);
        let mess = viVN.Errors("UnableHandleException");
        ShowNotification(mess, NotificationMessageType.Error);
      });
  };

  const onDeleteDocument = (data, folderItem = null, callBack = null) => {
    if (!data || !folderItem) return;

    props.showLoading(true);
    documentRepositoryAction.DocumentRepositoryDeleteDocument(data).then(
      () => {
        callBack && callBack();
        props.showLoading(false);
        ShowNotification("Xóa thành công", NotificationMessageType.Success);
        onGetAllDocumentByParentId(folderItem.id === -1 ? 0 : folderItem.id);
      },
      (err) => {
        props.showLoading(false);
        ShowNotification(
          viVN.Errors[(err && err.errorType) || "UnableHandleException"],
          NotificationMessageType.Error
        );
      }
    );
  };

  const onMoveDocument = (folderItem = null, callBack = null) => {
    if (!folderItem || !selectedFolderTemp) return;

    props.showLoading(true);
    let params = selectedItems.map((item) => {
      return {
        documentId: item.id,
        targetParentId: selectedFolderTemp.id < 1 ? 0 : selectedFolderTemp.id,
        targetFolderPath:
          selectedFolderTemp.id < 1 ? "" : selectedFolderTemp.path,
      };
    });

    documentRepositoryAction
      .DocumentRepositoryMoveDocument(params)
      .then(
        (res) => {
          callBack && callBack();
          props.showLoading(false);
          ShowNotification(
            "Di chuyển thành công",
            NotificationMessageType.Success
          );
          onGetAllDocumentByParentId(folderItem.id === -1 ? 0 : folderItem.id);
        },
        (err) => {
          props.showLoading(false);
          let mess =
            viVN.Errors[(err && err.errorType) || "UnableHandleException"];
          if (err && err.errorType === "FileExisted") {
            mess = err.errorMessage;
          }
          ShowNotification(mess, NotificationMessageType.Error);
        }
      )
      .catch((err) => {
        props.showLoading(false);
        let mess = viVN.Errors("UnableHandleException");
        ShowNotification(mess, NotificationMessageType.Error);
      });
  };

  const handleSuccess = (data) => {
    switch (actionType) {
      case ACTION_TYPES.CREATE_FOLDER:
        onCreateFolder(data, selectedFolder, () => {
          setActionType("");
          setOpen(false);
        });
        break;
      case ACTION_TYPES.UPLOAD_FILE:
        onUploadFile(fileUpload, selectedFolder, () => {
          setFileUpload([]);
          setActionType("");
          setOpen(false);
        });
        break;
      case ACTION_TYPES.RENAME:
        onRenameDocument(data, selectedFolder, () => {
          setActionType("");
          setSelectedItems([]);
          setOpen(false);
        });
        break;
      case ACTION_TYPES.DELETE:
        onDeleteDocument(
          selectedItems.map((item) => {
            return {
              id: item.id,
            };
          }),
          selectedFolder,
          () => {
            setActionType("");
            setSelectedItems([]);
            setOpen(false);
          }
        );
        break;
      case ACTION_TYPES.MOVE:
        onMoveDocument(selectedFolder, () => {
          setActionType("");
          setSelectedItems([]);
          setOpen(false);
        });
        break;
      default:
        break;
    }
  };

  const loopOpenFolder = (array, id) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        return array[i];
      } else {
        let data = loopOpenFolder(array[i].items || [], id);
        if (data) return data;
      }
    }
    return null;
  };

  const onSetSelectedFolder = (_selectedFolder = null) => {
    setFileItemsSearch([]);
    setSelectedFolder(_selectedFolder);
    setSelectedItems([]);

    if (props.isSearch) {
      onSearchFile({
        parentId: _selectedFolder.id === -1 ? 0 : _selectedFolder.id,
        fileName: _selectedFolder.name,
      });
      return;
    }

    if (!_selectedFolder) {
      setSelectedFolderList([]);
      return;
    }

    if (_selectedFolder.parentId >= 0) {
      let _arrayResult = [];
      let _fileItems = [];

      if (props.isSearch) {
        _fileItems = fileItemsSearch;
      } else {
        _fileItems = fileItems;
      }

      (_selectedFolder.pathIds || []).forEach((id) => {
        let data = loopOpenFolder(_fileItems[0].items, id);
        data && _arrayResult.push(data);
      });

      setSelectedFolderList([_fileItems[0]].concat(_arrayResult));
    } else {
      setSelectedFolderList([
        {
          ..._selectedFolder,
          items: [],
        },
      ]);
    }
  };

  const onSetSelectedFolderTemp = (_selectedFolder = null) => {
    setSelectedFolderTemp(_selectedFolder);
  };

  const contentDialog = (_actionType = "") => {
    switch (_actionType) {
      case ACTION_TYPES.COPY:
        return (
          <div className="dx-filemanager-container dx-widget">
            <div className="dx-drawer dx-widget dx-visibility-change-handler dx-drawer-shrink dx-drawer-slide dx-drawer-left dx-drawer-opened">
              <div className="dx-drawer-wrapper">
                <LeftPanel
                  rootData={fileItemsTemp}
                  fileItems={fileItemsTemp}
                  setFileItems={setFileItemsTemp}
                  selectedFolder={selectedFolderTemp}
                  setSelectedFolder={setSelectedFolderTemp}
                  onGetAllDocumentByParentId={onGetAllDocumentByParentId}
                />
              </div>
            </div>
          </div>
        );
      case ACTION_TYPES.MOVE:
        return (
          <div className="dx-filemanager-container dx-widget">
            <div className="dx-drawer dx-widget dx-visibility-change-handler dx-drawer-shrink dx-drawer-slide dx-drawer-left dx-drawer-opened">
              <div className="dx-drawer-wrapper">
                <LeftPanel
                  rootData={fileItemsTemp}
                  fileItems={fileItemsTemp}
                  setFileItems={setFileItemsTemp}
                  selectedItems={selectedItems}
                  selectedFolder={selectedFolderTemp}
                  setSelectedFolder={onSetSelectedFolderTemp}
                  onGetAllDocumentByParentId={onGetAllDocumentByParentId}
                  isMove={true}
                />
              </div>
            </div>
          </div>
        );
      case ACTION_TYPES.UPLOAD_FILE:
        return (
            <FileInputComponent
                listDistrict={props.listDistrict}
                isShowUi={isShowUi}
                onChangeFiles={setFileUpload}
                handleChooseDistrict={handleChooseDistrict}
            maxFileSize={configCommon.Configs.fileDocument}
            filesLimit={100}
            sizePriority={true}
            acceptedFiles={FILE_EXTENSION}
            placeholder="Chọn file"
            {...props}
          />
        );
      case ACTION_TYPES.PREVIEW_FILE:
        return (
          <div>
            {filePreview && (
              <FileViewer
                key={filePreview.id}
                fileId={filePreview.id}
                fileType={filePreview.extension.toLowerCase()}
                filePath={(APIUrlDefault + filePreview.path).replaceAll(
                  "//",
                  "/"
                )}
              />
            )}
          </div>
        );
      default:
        return <div></div>;
    }
  };

  return (
    <div>
      <div className="dx-widget dx-filemanager">
        <div className="dx-filemanager-notification-drawer dx-drawer dx-widget dx-visibility-change-handler dx-drawer-overlap dx-drawer-slide dx-drawer-right">
          <div className="dx-drawer-wrapper">
            <div className="dx-drawer-content" style={{ transform: "inherit" }}>
              <div
                className="dx-drawer-shader dx-state-invisible"
                style={{
                  visibility: "hidden",
                  opacity: 0,
                  zIndex: 1500,
                  transition: "none 0s ease 0s",
                }}
              ></div>
              <div className="dx-filemanager-notification-drawer-panel">
                <div className="dx-filemanager-wrapper">
                  <div className="dx-filemanager-toolbar dx-filemanager-general-toolbar">
                    <Toolbar
                      {...props}
                      selectedItems={selectedItems}
                      handleClickOpen={handleClickOpen}
                      setSelectedItems={setSelectedItems}
                      onDownloadDocument={onDownloadDocument}
                      _defaultFolderId={_defaultFolderId}
                      isTabletOrMobile={isTabletOrMobile}
                    />
                    <div className="dx-filemanager-view-switcher-popup" />
                  </div>
                  <div className="dx-filemanager-container dx-widget">
                    <div className="dx-drawer dx-widget dx-visibility-change-handler dx-drawer-shrink dx-drawer-slide dx-drawer-left dx-drawer-opened">
                      <div className={`dx-drawer-wrapper ${isTabletOrMobile && 'row'}`}>
                        {isShowLeft && (
                          <div className={`${isTabletOrMobile && 'col-12'}`} style={{minHeight:'150px'}}>
                            <LeftPanel
                              {...props}
                              rootData={fileItems}
                              fileItems={fileItems}
                              setFileItems={setFileItems}
                              selectedFolder={selectedFolder}
                              setSelectedFolder={onSetSelectedFolder}
                              onGetAllDocumentByParentId={
                                onGetAllDocumentByParentId
                              }
                            />
                          </div>
                        )}

                        <div className={`${isTabletOrMobile && 'col-12'}`} style={{minHeight:'150px'}}>
                          <RightPanel
                            {...props}
                            rootData={
                              props.isSearch ? fileItemsSearch : fileItems
                            }
                            isShowUi={isShowUi}
                            fileItems={
                              props.isSearch ? fileItemsSearch : fileItems
                            }
                            setFileItems={setFileItems}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                            selectedFolder={selectedFolder}
                            setSelectedFolder={onSetSelectedFolder}
                            selectedFolderList={selectedFolderList}
                            onGetAllDocumentByParentId={
                              onGetAllDocumentByParentId
                            }
                            onSearchFile={onSearchFile}
                            handleClickOpen={handleClickOpen}
                            selectedFolderTemp={selectedFolderTemp}
                            _defaultFolderId={_defaultFolderId}
                            typeFile={typeFile}
                            isTabletOrMobile={isTabletOrMobile}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {open && (
        <Dialog
                  listDistrict={props.listDistrict}
                  isShowUi={isShowUi}
          open={open}
          actionType={actionType}
          selectedItems={selectedItems}
          fileUpload={fileUpload}
          selectedFolder={
            actionType !== ACTION_TYPES.MOVE
              ? selectedFolder
              : selectedFolderTemp
          }
          maxWidth={maxWidthDialog(fileUpload.length)}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
          handleSuccess={handleSuccess}
          renderContent={() => contentDialog(actionType)}
        />
      )}

      {progressValue >= 0 && (
        <LoaddingProgress value={progressValue} />
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isLoading: state.app.loading,
  documentList: state.documentRepository.documentList,
  documentSearch: state.documentRepository.documentSearch,
    isSearch: state.documentRepository.isSearch,
    listDistrict: state.InitDocument.listDistrict,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showLoading: appActions.ShowLoading,
      onGetAllDocumentByParentId:
        documentRepositoryAction.DocumentRepositoryGetAllDocumentByParentId,
      onDocumentRepositorySearchDocument:
              documentRepositoryAction.DocumentRepositorySearchDocument,
          GetLookupDistrict: documentStore.GetLookupDistrict,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(FileManagement);
