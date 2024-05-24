/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import $ from "jquery";

import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import { Select, MenuItem, InputLabel} from "@material-ui/core";

import "./fileinput.min.css";
import "./file-input.scss";

export default function FileInputComponent(props) {
  //Function return file (default null)
  const onChangeFiles = props.onChangeFiles || null;
  //Function return status file delete (default null)
  const onDeleteFiles = props.onDeleteFiles || null;
  //Function of react-hook-form (default null and not required)
  const register = props.register || null;
  //Function error (default null)
  const onErrorFiles = props.onErrorFiles || null;

  //Number MB (default 5 MB)
  const maxFileSize = props.maxFileSize || 5;
  //Boolean size priority (default false)
  const sizePriority = props.sizePriority || false;
  //Boolean (default true)
  const showPreviews = props.showPreviews || true;
  //Array file type support example ["png", "jpg", "gif", "bmp", "jpeg"] (default [] = support all files)
  const acceptedFiles = props.acceptedFiles || [];
  //Number (default -1 = unlimited files)
  const filesLimit = props.filesLimit || -1;
  //Array file default (default [])
  const initialFiles = props.initialFiles || [];
  //String placeholder input file
  const placeholder =
    props.placeholder || filesLimit > 1 ? "Chọn files..." : "Chọn file...";
  //Array object custom file preview (default null)
  const filesPreviewCustom = props.filesPreviewCustom || null;

  const [isShowInput, setShowInput] = useState(true);
  const [files, setFiles] = useState([]);
    const [error, setError] = useState("");

    const isShowUi = props.isShowUi;

  //Initialization initialFiles default
  useEffect(() => {
    if (initialFiles.length > 0) {
      let _initialFiles = initialFiles.filter((file) => file);
      _initialFiles = _initialFiles.map((file) => {
        if (file instanceof Object) {
          let _filePreview = onGetFilePreview(file.fileType, file.filePreview);
          return {
            fileId: newGuid(),
            fileName: file.fileName || null,
            fileSize: file.fileSize || null,
            fileType: file.fileType || null,
            filePreview: _filePreview,
            fileData: null,
          };
        } else {
          let _filePreview = onGetFilePreview(null, file);
          return {
            fileId: newGuid(),
            fileName: null,
            fileSize: null,
            fileType: null,
            filePreview: _filePreview,
            fileData: null,
          };
        }
      });
      setFiles(_initialFiles);
    }
  }, []);

  //Refresh tag input when files change
  useEffect(() => {
    if (files.length === 0) {
      setShowInput(false);
      setTimeout(() => {
        setShowInput(true);
      }, 1);
    }
  }, [files]);

  const newGuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const bytesToSize = (bytes) => {
    if (bytes === 0) return 0;
    return bytes / Math.pow(1024, 2);
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleOpenFile = () => {
    if (props.onOpenFile) {
      props.onOpenFile();
    } else if (isShowInput) {
      $("#fileInput").click();
    }
  };

  const onSetError = (msg = null) => {
    onErrorFiles && onErrorFiles(msg);
    setError(msg);
  };

  const onGetFilePreview = (fileType = null, _filePreviewDefault = null) => {
    if (!fileType) return _filePreviewDefault;
    let _preview =
      filesPreviewCustom &&
      filesPreviewCustom.length > 0 &&
      filesPreviewCustom.find(
        (item) =>
          item.fileType &&
          item.fileType.toLowerCase() === fileType.toLowerCase()
      );

    if (_preview && _preview.filePreview) {
      return _preview.filePreview;
    }

    return _filePreviewDefault;
  };

  const setDefaultErrorImage = (
    event,
    imageDefault = require("./images/default.svg")
  ) => {
    event.target.onerror = null;
    event.target.src = imageDefault;
  };

  const handleChangeFiles = (e) => {
    if (e && e.target && e.target.files) {
      let _files = Array.from(e.target.files);

      if (sizePriority === true) {
        let totalSize = 0;

        files.map((file) => {
          if (file.fileSize !== null) {
            totalSize += file.fileSize;
          }
        });

        _files.map((file) => {
          if (file.size) {
            totalSize += file.size;
          }
        });

        if (bytesToSize(totalSize) > maxFileSize) {
          onSetError(
            `Tổng dung lượng files không được vượt quá ${maxFileSize} MB.`
          );
          return;
        }
      }

      if (filesLimit > 1 && files.length + _files.length > filesLimit) {
        onSetError(`Tải lên tối đa ${filesLimit} files`);
        return;
      }

      let _filesResult = [];
      let validateMsg = "";

      _files.forEach((file) => {
        if (validateFile(file)) {
          validateMsg = validateFile(file);
        } else {
          _filesResult.push(file);
        }
      });

      if (validateMsg) {
        onSetError(validateMsg);
        return;
      }

      Promise.all(
        _filesResult.map((file) => {
          return new Promise((resolve, reject) => {
            if (file.type.includes("image")) {
              let reader = new FileReader();
              reader.addEventListener("load", (ev) => {
                let _filePreview = onGetFilePreview(
                  file.type,
                  ev.target.result
                );
                resolve({
                  fileId: newGuid(),
                  fileName: file.name,
                  fileSize: file.size,
                  fileType: file.type,
                  filePreview: _filePreview,
                  fileData: file,
                });
              });
              reader.addEventListener("error", reject);
              reader.readAsDataURL(file);
            } else {
              let _filePreview = onGetFilePreview(file.type);
              resolve({
                fileId: newGuid(),
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                filePreview: _filePreview,
                fileData: file,
              });
            }
          });
        })
      ).then(
        (filesResult) => {
          let _filesResult = [];

          if (filesLimit > 1) {
            _filesResult = files.concat(filesResult);
          } else {
            _filesResult = filesResult;
            if (initialFiles.length > 0) {
              onDeleteFiles && onDeleteFiles(true);
            }
          }
          onSetError("");
          setFiles(_filesResult);
          onChangeFiles &&
            onChangeFiles(
              filesLimit > 1
                ? _filesResult.map((file) => {
                    return file.fileData;
                  })
                : _filesResult[0].fileData
            );
        },
        (error) => {
          console.error(error);
        }
      );
    }
  };

  const validateFile = (
    file,
    acceptFileExtensions = acceptedFiles,
    maximumSize = maxFileSize
  ) => {
    if (!file) {
      return "File không được để trống.";
    }

    if (bytesToSize(file.size) > maximumSize) {
      return `Kích thước file không được vượt quá ${maximumSize} MB.`;
    }

    if (
      file.name !== null &&
      file.name !== "" &&
      file.name !== undefined &&
      acceptFileExtensions &&
      acceptFileExtensions.length > 0
    ) {
      let fileExt = file.name.replace(/^.*\./, "");
      if (
        !acceptFileExtensions.some(
          (x) => x.toUpperCase() === fileExt.toUpperCase()
        )
      ) {
        return `File cho phép tải lên: ${acceptFileExtensions.toString()}`;
      }
    }

    return "";
  };

  const handleDeleteFile = (_fileId = null) => {
    if (!_fileId) return;
    let filesResult = files.filter((file) => file.fileId !== _fileId);

    onSetError("");
    setFiles(filesResult);
    onChangeFiles &&
      onChangeFiles(
        filesLimit > 1
          ? filesResult.map((file) => {
              return file.fileData;
            })
          : null
      );
    onDeleteFiles &&
      onDeleteFiles(
        files.find((file) => file.fileId === _fileId && file.fileData)
      );
  };

  const renderSingleFilePreview = (file) => {
    return (
      <div
        key={file.fileId}
        className="file-preview-frame krajee-default kv-preview-thumb"
      >
        <div
          className={`kv-file-content ${
            !file.filePreview ? " kv-file-content-custom" : ""
          }`}
        >
          <img
            src={
              file.filePreview
                ? file.filePreview
                : require("./images/default.svg")
            }
            onError={setDefaultErrorImage}
            alt={file.fileName || ""}
            title={file.fileName || ""}
            className="file-preview-image kv-preview-data"
          />
        </div>
        <div className="file-thumbnail-footer">
          <div className="file-footer-caption" title={file.fileName || ""}>
            <div className="file-caption-info">{file.fileName || ""}</div>
            <div className="file-size-info">
              {file.fileSize !== null && (
                <samp>({formatBytes(file.fileSize)})</samp>
              )}
            </div>
          </div>
          <div className="file-actions">
            <div className="file-footer-buttons">
              <button
                type="button"
                className="kv-file-remove btn btn-sm btn-kv btn-default btn-outline-secondary"
                title="Gỡ bỏ"
                onClick={() => handleDeleteFile(file.fileId)}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMultipleFilePreview = (file) => {
    return (
      <div
        key={file.fileId}
        className="file-preview-frame krajee-default kv-preview-thumb"
      >
        <div
          className={`kv-file-content ${
            !file.filePreview ? " kv-file-content-custom" : ""
          }`}
        >
          <img
            src={
              file.filePreview
                ? file.filePreview
                : require("./images/default.svg")
            }
            onError={setDefaultErrorImage}
            alt={file.fileName || ""}
            title={file.fileName || ""}
            className="file-preview-image kv-preview-data"
          />
        </div>
        <div className="file-thumbnail-footer">
          <div className="file-footer-caption" title={file.fileName || ""}>
            <div className="file-caption-info">{file.fileName || ""}</div>
            <div className="file-size-info">
              {file.fileSize !== null && (
                <samp>({formatBytes(file.fileSize)})</samp>
              )}
            </div>
          </div>
          <div className="file-actions">
            <div className="file-footer-buttons">
              <button
                type="button"
                className="kv-file-remove btn btn-sm btn-kv btn-default btn-outline-secondary"
                title="Gỡ bỏ"
                onClick={() => handleDeleteFile(file.fileId)}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInputFile = () => {
    let _acceptedFiles =
      acceptedFiles && acceptedFiles.length > 0
        ? acceptedFiles
            .map((item) => {
              return "." + item;
            })
            .toString()
        : "";

    //Required file
    if (register !== null) {
      let _required = files && files.length === 0 ? true : false;
      return (
        <input
          id="fileInput"
          name="fileInput"
          ref={register({
            required: _required,
          })}
          type="file"
          className="input-file"
          accept={_acceptedFiles}
          multiple={filesLimit && filesLimit > 1}
          onChange={handleChangeFiles}
        />
      );
    }

    //Not required file
    return (
      <input
        id="fileInput"
        name="fileInput"
        type="file"
        className="input-file"
        accept={_acceptedFiles}
        multiple={filesLimit && filesLimit > 1}
        onChange={handleChangeFiles}
      />
    );
  };

    return (
        <div>
            {
                isShowUi && 
                <div className="col-12 col-md-12 col-lg-12">
                    <div className="form-group">
                        <InputLabel>
                            Quận - huyện
                                            </InputLabel>
                        <Select placeholder="Chọn quận, huyện"
                            fullWidth
                            onChange={props.handleChooseDistrict}
                        >
                            {props.listDistrict && props.listDistrict.length > 0 ? (
                                props.listDistrict.map((item) => (
                                    <MenuItem value={item.id}>{item.name}</MenuItem>
                                ))
                            ) : (
                                    <MenuItem value="">Không có quận huyện nào</MenuItem>
                                )}

                        </Select>
                    </div>

                </div>
            }
    <div className="file-input">
      <div className="file-preview">
        <div className="file-drop-zone clearfix clickable">
          <div className="file-drop-zone-title" onClick={handleOpenFile}>
            {placeholder} <br />
            <CloudUploadIcon style={{ fontSize: 55 }} />
          </div>
          {showPreviews && (
            <div
              className={`file-preview-thumbnails ${
                files.length === 1 ? "one-file-preview" : "multi-file-preview"
              }`}
            >
              {files.length === 1
                ? renderSingleFilePreview(files[0])
                : files.map((file) => renderMultipleFilePreview(file))}
            </div>
          )}
          {error && (
            <div className="kv-fileinput-error file-error-message">{error}</div>
          )}
          {isShowInput && renderInputFile()}
        </div>
      </div>
            </div>
            </div>
  );
}
