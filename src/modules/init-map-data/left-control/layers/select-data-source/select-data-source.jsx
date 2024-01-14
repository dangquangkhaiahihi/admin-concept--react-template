import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as InitMapStore from "../../../../../redux/store/init-map/init-map.store";
import * as mappingData from "../../../../../redux/store/init-map/mapping-data";
import * as InitmapConfig from "../../../config/config";
import "./select-data-source.scss";
import NotificationService from "../../../../../common/notification-service";
import { WmsBaseLink } from "../../../../../utils/configuration";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { FormControlLabel, Radio } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import * as configution from "../../../../../utils/configuration";
import { SettingsInputAntenna } from "@material-ui/icons";

let GlobalIdTimeOut = null;

function SelectDataSourceLayer(props) {
  const {
    isImportShapeFile,
    setIsImportShapeFile,
    isImportTifFile,
    setIsImportTifFile,
    setValueShapeFileStep_1,
    valueShapeFileStep_1,
    isCompleteImportShapeFile,
    setDataSource,
    valueTiffFile_2,
    setValueTiffFile2,
    setViewDetail,
    setPopup,
    setTooltip,
    setInput,
    setOutput,
  } = props;

  const [wmsParameters, setWmsParameter] = useState(
    props.dataSource.wmsParameters
  );
  const [wmsLink, setWmsLink] = useState(props.dataSource.wms);
  const [tableName, setTableName] = useState("");
  const [style, setStyle] = useState(props.dataSource.style);
  const [isWmsOutSystem, setIsWmsOutSystem] = useState(false);
  const [showWmsWrong, setShowWmsWrong] = useState(false);
  const [hasShowTableNameWarning, setShowTableNameWarning] = useState(false);

  useEffect(() => {
    if (isCompleteImportShapeFile) {
      handleChangeWmsInSystem();
    }
  }, [isCompleteImportShapeFile]);

  const handleCreateWmsLink = () => {
    let newDataSource = null;

    if (isWmsOutSystem && wmsLink) {
      const tableName = InitmapConfig.getTableNameFormUrl(wmsLink);
      let colsOfTable = null;
      props.listDataSource.map((data) => {
        if (data.tableName === tableName) {
          colsOfTable = data.cols;
          return;
        }
      });
      if (!colsOfTable) return setShowWmsWrong(true);
      setShowWmsWrong(false);
      newDataSource = new InitmapConfig.CreateDataSourceObject(
        tableName,
        colsOfTable,
        wmsLink,
        null,
        wmsParameters,
        isWmsOutSystem
      );
    } else {
      const tableSelected = props.listDataSource.filter(
        (data) => data.tableName === tableName
      );
      mappingData.GetListPgTable(tableName).then((res) => {
        let data = []
        res.content.map((col) =>
          data.push({
            column_name: col.col,
            data_type: col.kieu,
            label: col.alias || col.col,
            checked: (col.col === col.alias ||
              col.col == 'layer' ||
              col.col == 'geom' ||
              col.col == 'style' ||
              col.col == 'id' ||
              col.col == 'objectid' ? false : true)
          })
        )
        return data
      })
        .then((res) => {
          setViewDetail(res);
          setPopup(res);
          setTooltip(res);
          setInput(res);
          setOutput(res);
          console.log(res)
          if (tableSelected[0]) {
            console.log(tableSelected[0].cols)
            setShowTableNameWarning(false);
            newDataSource = new InitmapConfig.CreateDataSourceObject(
              tableName,
              res,
              WmsBaseLink,
              style,
              null,
              isWmsOutSystem
            );
          } else setShowTableNameWarning(true);
          if (newDataSource) {
            console.log(newDataSource)
            setDataSource(newDataSource)
          };
        })

    }
    // if (newDataSource) setDataSource(newDataSource);
    // else
    //   NotificationService.error(
    //     "Dữ liệu khởi tạo không đúng, vui lòng kiểm tra lại"
    //   );
  };

  const createTaskCreateWmsLink = () => {
    GlobalIdTimeOut = setTimeout(() => {
      handleCreateWmsLink();
      GlobalIdTimeOut = null;
    }, 750);
  };

  useEffect(() => {
    setTableName(props.dataSource.tableName);
    props.GetListDataSource();
    if (props.dataSource.wms_external) setIsWmsOutSystem(true);
  }, []);

  useEffect(() => {
    if (tableName || wmsLink) {
      if (GlobalIdTimeOut) {
        clearTimeout(GlobalIdTimeOut);
      }
      //getLookupPgTable(tableName)
      createTaskCreateWmsLink();
    }
  }, [tableName, wmsLink]);

  // const getLookupPgTable = (table) => {
  //   mappingData.GetListPgTable(table).then((res) => {
  //     let data = []
  //     res.content.map((col) =>
  //       data.push({
  //         column_name: col.col,
  //         data_type: col.kieu,
  //         label: col.alias,
  //         checked: false
  //       })
  //     )
  //     setListPgcols(data);
  //   })
  // }

  const handleChangeImportShapeFile = () => {
    setIsImportShapeFile(true);
    setIsWmsOutSystem(false);
    setIsImportTifFile(false);
  };

  const handleChangeWmsInSystem = () => {
    setIsImportShapeFile(false);
    setIsWmsOutSystem(false);
    setIsImportTifFile(false);
  };

  const handleChangeWmsOutSystem = () => {
    setIsImportShapeFile(false);
    setIsWmsOutSystem(true);
    setIsImportTifFile(false);
  };

  const handleChangeImportTifFile = () => {
    setIsImportShapeFile(false);
    setIsWmsOutSystem(false);
    setIsImportTifFile(true);
  };
  const handleChangeFile = (e) => {
    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.length > 0 &&
      setValueShapeFileStep_1({ ...valueShapeFileStep_1, file: filesArr[0] });
  };

  return (
    <div className="select-data-source-container">
      <div className="container-fluid">
        <div className="row">
          <div className="col-9 mx-auto text-center">
            <div className="container-select-wms row no-gutters">
              <div className="col-3">
                <FormControlLabel
                  control={
                    <Radio
                      color="primary"
                      checked={
                        isImportShapeFile && !isWmsOutSystem && !isImportTifFile
                      }
                      onChange={handleChangeImportShapeFile}
                    />
                  }
                  label="Import Shape file"
                  disabled={isCompleteImportShapeFile}
                />
              </div>

              <div className="col-3">
                <FormControlLabel
                  control={
                    <Radio
                      color="primary"
                      checked={
                        isImportTifFile && !isWmsOutSystem && !isImportShapeFile
                      }
                      onChange={handleChangeImportTifFile}
                    />
                  }
                  label="Import Tif file"
                  disabled={isCompleteImportShapeFile}
                />
              </div>

              <div className="col-3">
                <FormControlLabel
                  control={
                    <Radio
                      color="primary"
                      checked={
                        !isWmsOutSystem &&
                        !isImportShapeFile &&
                        !isImportTifFile
                      }
                      onChange={handleChangeWmsInSystem}
                    />
                  }
                  label="Wms trong hệ thống"
                />
              </div>

              <div className="col-3">
                <FormControlLabel
                  control={
                    <Radio
                      color="primary"
                      checked={
                        isWmsOutSystem && !isImportShapeFile && !isImportTifFile
                      }
                      onChange={handleChangeWmsOutSystem}
                    />
                  }
                  label="Wms ngoài hệ thống"
                />
              </div>
            </div>
          </div>
        </div>

        {isImportShapeFile && !isWmsOutSystem && !isImportTifFile && (
          <div className="row mt-3">
            <div className="col-6 mx-auto">
              <Paper className="p-3" elevation={3}>
                <div className="form-group">
                  <TextField
                    fullWidth
                    onChange={(event) =>
                      setValueShapeFileStep_1({
                        ...valueShapeFileStep_1,
                        TableName: event.target.value,
                      })
                    }
                    variant="outlined"
                    size="small"
                    label="Tên bảng"
                    error={props.error}
                  />
                  {props.error && <span className="error">{props.error}</span>}
                </div>
                <div>
                  <input
                    type="file"
                    onChange={handleChangeFile}
                    accept=".zip"
                  />
                </div>
              </Paper>
            </div>
          </div>
        )}

        {isImportTifFile && !isWmsOutSystem && !isImportShapeFile && (
          <div className="row mt-3">
            <div className="col-6 mx-auto">
              <Paper className="p-3" elevation={3}>
                <div className="form-group">
                  <TextField
                    fullWidth
                    onChange={(event) =>
                      setValueTiffFile2({
                        ...valueTiffFile_2,
                        TiffName: event.target.value,
                      })
                    }
                    variant="outlined"
                    size="small"
                    label="Tên tiff"
                    error={props.error}
                  />
                  {props.error && <span className="error">{props.error}</span>}
                </div>
                <div>
                  <input
                    type="file"
                    onChange={(event) => {
                      let arrFiles = Array.prototype.slice.call(
                        event.target.files
                      );
                      arrFiles.length > 0 &&
                        setValueTiffFile2({
                          ...valueTiffFile_2,
                          file: arrFiles[0],
                        });
                    }}
                    accept=".tif, .tiff"
                  />
                </div>
              </Paper>
            </div>
          </div>
        )}

        {isWmsOutSystem && !isImportShapeFile && !isImportTifFile && (
          <div className="row mt-3">
            <div className="col-6 mx-auto">
              <Paper className="p-3" elevation={3}>
                <div className="wms-out-system-container">
                  <div className="form-group">
                    <TextField
                      value={wmsLink}
                      fullWidth
                      error={showWmsWrong}
                      onChange={(event) => setWmsLink(event.target.value)}
                      id="filled-error-helper-text"
                      label="Link web map service ngoài hệ thống"
                      helperText={
                        showWmsWrong
                          ? "Link nhập vào không chính xác, vui lòng kiểm tra lại"
                          : ""
                      }
                      variant="outlined"
                      size="small"
                    />
                  </div>

                  <div>
                    <TextField
                      value={wmsParameters}
                      fullWidth
                      onChange={(event) => setWmsParameter(event.target.value)}
                      id="filled-error-helper-text"
                      label="Tham số wms"
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </div>
              </Paper>
            </div>
          </div>
        )}

        {!isWmsOutSystem && !isImportShapeFile && !isImportTifFile && (
          <div className="row mt-3">
            <div className="col-6 mx-auto">
              <Paper className="p-3" elevation={3}>
                <div className="wms-in-system-container">
                  <Autocomplete
                    id="selectDatasource"
                    blurOnSelect={true}
                    fullWidth={true}
                    disableClearable={true}
                    onChange={(event, newValue) =>
                      setTableName(newValue.tableName)
                    }
                    inputValue={tableName}
                    onInputChange={(event, newValue) => setTableName(newValue)}
                    options={props.listDataSource}
                    getOptionLabel={(option) => option.tableName}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nhập tên bảng hoặc chọn từ danh sách bên cạnh"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                  <p
                    className="mt-1 mb-0 text-danger"
                    hidden={!hasShowTableNameWarning}
                  >
                    Trường này không được bỏ trống
                  </p>
                  <div className="form-group" hidden>
                    <label htmlFor="selectStyle">Style:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="selectStyle"
                      value={style}
                      onChange={(event) => setStyle(event.target.value)}
                      placeholder="Nhập style"
                    />
                  </div>
                </div>
              </Paper>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  listDataSource: state.initMap.arrayDataSource,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      GetListDataSource: InitMapStore.GetListDataSource,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectDataSourceLayer);
