import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./modal-setting.scss";
import SelectDataSourceLayer from "../select-data-source/select-data-source";
import * as InitmapConfig from "../../../config/config";
import SettingLayerTypeView from "../setting-layer/setting-layer";
import NotificationService from "../../../../../common/notification-service";
import SettingInfomationViewLayer from "../layer-infomation-view/layer-infomation-view";
import SettingLayerFilter from "../layer-filter-setting/layer-filter-setting";
import FinishScreen from "../finishScreen/finishScreen";
import { Button, Step, StepLabel, Stepper } from "@material-ui/core";

import ShowNotification from "../../../../../components/react-notifications/react-notifications";
import {
  NotificationMessageType,
  WmsBaseLink,
} from "../../../../../utils/configuration";
import * as viVN from "../../../../../language/vi-VN.json";
import * as appActions from "../../../../../core/app.store";

import * as importShapeFileAction from "../../../../../redux/store/import-shape-tiff-file/import-shape-file.store";
import * as importTiffFileAction from "../../../../../redux/store/import-shape-tiff-file/import-tiff-file.store";
import * as layerAction from "../../../../../redux/store/init-map/map-layer.store";

function ModalLayerSetting(props) {
  const { showLoading, layerId } = props;
  const [dataSource, setDataSource] = useState(
    InitmapConfig.CreateDataSourceObject()
  );
  const [layerSetting, setLayerSetting] = useState(
    InitmapConfig.CreateLayerSettingObject()
  );
  const [layerViewSetting, setLayerViewSetting] = useState(null);
  const [layerFilterSetting, setLayerFilterSetting] = useState(null);
  const [viewDetail, setViewDetail] = useState([]);
  const [popup, setPopup] = useState([]);
  const [tooltip, setTooltip] = useState([]);
  const [input, setInput] = useState([]);
  const [output, setOutput] = useState([]);

  const [activeStepWms, setActiveStepWms] = useState(0);
  const [activeStepShapeFile, setActiveStepShapeFile] = useState(0);
  const [activeStepTifFile, setActiveStepTifFile] = useState(0);

  const [skipped, setSkipped] = useState(new Set());

  const [isImportShapeFile, setIsImportShapeFile] = useState(true);
  const [isCompleteImportShapeFile, setIsCompleteImportShapeFile] = useState(
    false
  );

  const [styleName, setStyleName] = useState();
  const [error, setError] = useState("");

  const [isImportTifFile, setIsImportTifFile] = useState(false);
  // get value shape file
  const [valueShapeFileStep_1, setValueShapeFileStep_1] = useState({
    TableName: "",
    file: "",
  });

  const [isCreateBaseOnExistLayer, setIsCreateBaseOnExistLayer] = useState(false);
  const [layerSelected, setLayerSelected] = useState();

  const [valueShapeFileStep_2, setValueShapeFileStep_2] = useState({
    RootFolderName: "",
    ShpFileName: "",
    TableName: "",
  });
  const [valueShapeFileStep_3, setValueShapeFileStep_3] = useState({
    RootFolderName: "",
    TableName: "",
    PlanningId: -1,
    ListStyles: [],
  });
  const [valueShapeFileStep_4, setValueShapeFileStep_4] = useState({
    RootFolderName: "",
    TableName: "",
    StyleName: "",
  });

  //get value tiff file
  const [valueTiffFile_2, setValueTiffFile2] = useState({
    TiffName: "",
    file: "",
  });

  //line step
  const stepWms = [
    "Thiết lập nguồn dữ liệu",
    "Thiết lập thông số",
    "Tùy chọn thông tin hiển thị",
    "Tùy chọn lọc thông tin",
  ];
  const stepShp = [
    "Nhập và giải nén tệp",
    "Nhập shape file vào postgis",
    "Tạo Sld và nhập vào postgis",
    "Công bố",
  ];

  const setValueShapeFileStep1 = (data) => {
    setValueShapeFileStep_1(data);
    if (data.TableName && /^[a-zA-Z]+(([_][a-zA-Z0-9])?[a-zA-Z0-9]*)*$/.test(data.TableName)) {
      setError("");
    } else {
      setError("Tên bảng chứa ký tự chữ, số và dấu gạch dưới VD: ten_bang");
    }
  };

  const setValueTiffFile = (data) => {
    setValueTiffFile2(data);
    if (data.TiffName && /^[a-zA-Z]+(([_][a-zA-Z0-9])?[a-zA-Z0-9]*)*$/.test(data.TiffName)) {
      setError("");
    } else {
      setError("Tên bảng chứa ký tự chữ, số và dấu gạch dưới VD: ten_bang");
    }
  };

  useEffect(() => {
    console.log(layerSetting)
  }, [layerSetting])
  //content step
  function getStepContentWms(step) {
    switch (step) {
      case 0:
        return dataSource ? (
          <SelectDataSourceLayer
            setViewDetail={setViewDetail}
            setPopup={setPopup}
            setTooltip={setTooltip}
            setInput={setInput}
            setOutput={setOutput}
            dataSource={dataSource}
            setDataSource={setDataSource}
            isImportShapeFile={isImportShapeFile}
            setIsImportShapeFile={setIsImportShapeFile}
            isImportTifFile={isImportTifFile}
            setIsImportTifFile={setIsImportTifFile}
            setValueShapeFileStep_1={setValueShapeFileStep1}
            valueShapeFileStep_1={valueShapeFileStep_1}
            valueTiffFile_2={valueTiffFile_2}
            setValueTiffFile2={setValueTiffFile}
            isCompleteImportShapeFile={isCompleteImportShapeFile}
            error={error}
            isCreateBaseOnExistLayer={isCreateBaseOnExistLayer}
            setIsCreateBaseOnExistLayer={setIsCreateBaseOnExistLayer}
            layerSelected={layerSelected}
            setLayerSelected={setLayerSelected}
            isLayerRela={props.isLayerRela}
            layerId={layerId}
          />
        ) : null;
      case 1:
        return (
          <SettingLayerTypeView
            layerSetting={layerSetting}
            setLayerSetting={setLayerSetting}
            isImportShapeFile={isImportShapeFile}
            valueShapeFileStep_2={valueShapeFileStep_2}
            setValueShapeFileStep_2={setValueShapeFileStep_2}
            isLayerRela={props.isLayerRela}
            layerId={layerId}
          />
        );
      case 2:
        if (!dataSource) return null;

        return (
          <SettingInfomationViewLayer
            viewDetail={viewDetail}
            popup={popup}
            tooltip={tooltip}
            setViewDetail={setViewDetail}
            setPopup={setPopup}
            setTooltip={setTooltip}
            dataSource={dataSource}
            setDataSource={setDataSource}
            layerViewSetting={
              new InitmapConfig.CreateLayerDisplayInfomationSettingObjectDefault(
                dataSource
              )
            }
            setLayerViewSetting={setLayerViewSetting}
            isImportShapeFile={isImportShapeFile}
            valueShapeFileStep_3={valueShapeFileStep_3}
            setValueShapeFileStep_3={setValueShapeFileStep_3}
            setStyleName={setStyleName}
          />
        );
      case 3:
        if (!dataSource) return null;
        return (
          <SettingLayerFilter
            input={input}
            output={output}
            setInput={setInput}
            setOutput={setOutput}
            layerFilterSetting={
              new InitmapConfig.CreateLayerFilterObjectDefault(dataSource)
            }
            setLayerFilterSetting={setLayerFilterSetting}
            dataSource={dataSource}
            isImportShapeFile={isImportShapeFile}
            valueShapeFileStep_4={valueShapeFileStep_4}
            setValueShapeFileStep_4={setValueShapeFileStep_4}
            numberCase={3}
          />
        );
      default:
        return "";
    }
  }

  const isThisStepCompleted = (step) => {
    switch (step) {
      case 0:
        return dataSource.wms ? true : false;
      default:
        return true;
    }
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  //--- Wms
  const handleNextWms = (step) => {
    switch (step) {
      case 1: {
        if (!layerSetting.layerName) {
          NotificationService.error("Trường tên layer không được để trống");
          return;
        }
        if (props.isLayerRela) {
          if (!layerSetting.year) {
            NotificationService.error("Trường năm điều chỉnh không được để trống");
            return;
          }
          if (!layerSetting.contentChange) {
            NotificationService.error("Trường nội dung điều chỉnh không được để trống");
            return;
          }
        }
        setActiveStepWms((prevActiveStep) => prevActiveStep + 1);
        break;
      }
      default: {
        let newSkipped = skipped;
        if (isStepSkipped(activeStepWms)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(activeStepWms);
        }
        setActiveStepWms((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
      }
    }
  };

  const handleBackWms = () => {
    setActiveStepWms((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAccept = (
    _layerCategoryId = props.layerCategoryId,
    _dataSource = dataSource,
    _layerSetting = layerSetting,
    // _layerViewSetting = layerViewSetting,
    // _layerFilterSetting = layerFilterSetting
    _layerViewSetting = { viewDetail, tooltip, popup },
    _layerFilterSetting = { input, output },
    _planningId = props.planningId,
  ) => {
    const NewLayerCreated = InitmapConfig.MergeLayerPropertyToStandardObject(
      _layerCategoryId,
      _dataSource,
      _layerSetting,
      _layerViewSetting,
      _layerFilterSetting,
      _planningId,
    );
    props.handleAddNewLayer(NewLayerCreated);
    props.closeModal();
  };

  const handleAcceptCreateBaseOnExistLayer = (layer) => {
    const NewLayerCreated = InitmapConfig.FormatLayerSetting(layer);
    props.handleCreateBaseOnExistLayer(NewLayerCreated);
    props.closeModal();
  }

  const handleAcceptTif = (
    _dataSource = dataSource,
    _layerSetting = layerSetting,
    _layerViewSetting = layerViewSetting,
    _layerFilterSetting = layerFilterSetting,
    _layerCategoryId = props.layerCategoryId
  ) => {
    const NewLayerCreated = InitmapConfig.MergeLayerPropertyToStandardObject(
      _layerCategoryId,
      _dataSource,
      _layerSetting,
      _layerViewSetting,
      _layerFilterSetting
    );
    props.handleAddNewLayer(NewLayerCreated);
    props.closeModal();
  };

  //--- Shape file
  const handleNextShapeFile = (step) => {
    showLoading(true);
    let newSkipped = skipped;
    if (isStepSkipped(activeStepShapeFile)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStepShapeFile);
    }
    switch (step) {
      case 0: {
        ImportShapeFileStep1(valueShapeFileStep_1)
          .then((res) => {
            if (res && res.content && res.content.data) {
              const reponse = res.content.data;
              setValueShapeFileStep_2({
                RootFolderName: reponse.RootFolderName,
                ShpFileName: reponse.ShpFileName,
                TableName: reponse.TableName,
              });
              setActiveStepShapeFile((prevActiveStep) => prevActiveStep + 1);
              setSkipped(newSkipped);
            }
            showLoading(false);
          })
          .catch((err) => showLoading(false));
        break;
      }
      case 1: {
        ImportShapeFileStep2(valueShapeFileStep_2)
          .then((res) => {
            if (res && res.content && res.content.data) {
              const reponse = res.content.data;
              console.log(reponse);
              setValueShapeFileStep_3({
                RootFolderName: reponse.RootFolderName,
                TableName: reponse.TableName,
                PlanningId: props.planningId,
                ListStyles: JSON.parse(reponse.ListStyles)
              });
              setActiveStepShapeFile((prevActiveStep) => prevActiveStep + 1);
              setSkipped(newSkipped);
            }
            showLoading(false);
          })
          .catch((err) => {
            console.log(err);
            showLoading(false)
          }
          );
        break;
      }
      case 2: {
        ImportShapeFileStep3(valueShapeFileStep_3)
          .then((res) => {
            if (res && res.content && res.content.data) {
              const reponse = res.content.data;
              setValueShapeFileStep_4({
                RootFolderName: reponse.RootFolderName,
                TableName: reponse.TableName,
                StyleName: reponse.StyleName,
              });
              setActiveStepShapeFile((prevActiveStep) => prevActiveStep + 1);
              setSkipped(newSkipped);
            }
            showLoading(false);
          })
          .catch((err) => showLoading(false));
        break;
      }
      case 3: {
        ImportShapeFileStep4(valueShapeFileStep_4)
          .then((res) => {
            if (res && res.content && res.content.data) {
              setActiveStepShapeFile((prevActiveStep) => prevActiveStep + 1);
              setSkipped(newSkipped);
              ShowNotification(
                viVN.Success.ImportShapeFileSuccess,
                NotificationMessageType.Success
              );
              setIsImportShapeFile(false);
              setIsImportTifFile(false);
              setIsCompleteImportShapeFile(true);
            }
            showLoading(false);
          })
          .catch((err) => showLoading(false));

        break;
      }
      default: {
        setIsImportShapeFile(false);
        setIsImportTifFile(false);
        setIsCompleteImportShapeFile(true);
        showLoading(false);
        break;
      }
    }
  };

  const handleBackShapeFile = () => {
    setActiveStepShapeFile((prevActiveStep) => prevActiveStep - 1);
  };

  const ImportShapeFileStep1 = (valueShapeFileStep_1) => {
    return new Promise((resolve, reject) => {
      importShapeFileAction.ImportShapeFileStep1(valueShapeFileStep_1).then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };
  const ImportShapeFileStep2 = (valueShapeFileStep_2) => {
    return new Promise((resolve, reject) => {
      importShapeFileAction.ImportShapeFileStep2(valueShapeFileStep_2).then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };
  const ImportShapeFileStep3 = (valueShapeFileStep_3) => {
    return new Promise((resolve, reject) => {
      if (styleName)
        valueShapeFileStep_3.styleName = styleName.Name;
      else
        valueShapeFileStep_3.styleName = "";
      importShapeFileAction.ImportShapeFileStep3(valueShapeFileStep_3).then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };
  const ImportShapeFileStep4 = (valueShapeFileStep_4) => {
    return new Promise((resolve, reject) => {
      importShapeFileAction.ImportShapeFileStep4(valueShapeFileStep_4).then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };
  //--- CreateBaseOnExistLayer
  const handleCreateBaseOnExistLayer = (layerId, layerSelected) => {
        if (layerId && layerSelected) {
          showLoading(true);
          layerAction.CreateBaseOnExistLayer({ id: layerSelected.id, parrentId: layerId })
            .then((res) => {
              console.log(res);
              handleAcceptCreateBaseOnExistLayer(res.content)
              showLoading(false);
            })
            .catch(err => { showLoading(false) });
        } else return;
  }

  //--- Tif file
  const handleNextTifFile = (step) => {
    showLoading(true);
    let newSkipped = skipped;
    if (isStepSkipped(activeStepShapeFile)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStepShapeFile);
    }
    switch (step) {
      case 0: {
        ImportTiffFile(valueTiffFile_2)
          .then((res) => {
            if (res && res.content) {
              ShowNotification(
                viVN.Success.ImportTiffFileSuccess,
                NotificationMessageType.Success
              );
              setSkipped(newSkipped);
              const _dataSource = InitmapConfig.CreateDataSourceObject(
                valueTiffFile_2.TiffName,
                [],
                WmsBaseLink
              );
              const _layerSetting = InitmapConfig.CreateLayerSettingObject(
                valueTiffFile_2.TiffName,
                0,
                20,
                1,
                true,
                valueTiffFile_2?.year,
                valueTiffFile_2?.contentChange,
                valueTiffFile_2?.layerRealationshipId
              );
              const _layerViewSetting = new InitmapConfig.CreateLayerDisplayInfomationSettingObjectDefault(
                _dataSource
              );
              const _layerFilterSetting = new InitmapConfig.CreateLayerFilterObjectDefault(
                _dataSource
              );
              handleAcceptTif(
                _dataSource,
                _layerSetting,
                _layerViewSetting,
                _layerFilterSetting
              );
            }
            showLoading(false);
          })
          .catch((err) => {
            showLoading(false);
            console.log("err", err);
          });
        break;
      }
      default: {
        setIsImportShapeFile(false);
        setIsImportTifFile(false);
        setIsCompleteImportShapeFile(true);
        showLoading(false);
        break;
      }
    }
  };

  const handleBackTifFile = () => {
    setActiveStepTifFile((prevActiveStep) => prevActiveStep - 1);
  };

  const ImportTiffFile = (valueTiffFile_2) => {
    return new Promise((resolve, reject) => {
      importTiffFileAction.ImportTiffFile(valueTiffFile_2).then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  const RenderStepper = () => {
    if (isImportShapeFile && !isCreateBaseOnExistLayer) {
      return (
        <Stepper activeStep={activeStepShapeFile}>
          {stepShp.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      );
    }

    if (!isImportTifFile && !isCreateBaseOnExistLayer) {
      return (
        <Stepper activeStep={activeStepWms}>
          {stepWms.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      );
    }

    return <div></div>;
  };

  const RenderButton = () => {
    if (isImportShapeFile) {
      return (
        <div className="mt-3">
          <Button
            variant="contained"
            disabled={activeStepShapeFile === 0}
            onClick={handleBackShapeFile}
            className="action-button mr-2"
          >
            Quay lại
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={error ? true : false}
            onClick={() => handleNextShapeFile(activeStepShapeFile)}
            className="action-button"
          >
            Tiếp tục
          </Button>
        </div>
      );
    }

    if (isImportTifFile) {
      return (
        <div className="mt-3">
          <Button
            variant="contained"
            disabled={activeStepTifFile === 0}
            onClick={handleBackTifFile}
            className="action-button mr-2"
          >
            Quay lại
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={error ? true : false}
            onClick={() => handleNextTifFile(activeStepTifFile)}
            className="action-button"
          >
            Publish
          </Button>
        </div>
      );
    }

    if (isCreateBaseOnExistLayer) {
      return (
        <div className="mt-3">
          {/* <Button
            variant="contained"
            disabled={activeStepTifFile === 0}
            onClick={handleBackTifFile}
            className="action-button mr-2"
          >
            Quay lại
          </Button> */}
          <Button
            variant="contained"
            color="primary"
            disabled={!layerSelected ? true : false}
            onClick={() => handleCreateBaseOnExistLayer(layerId, layerSelected)}
            className="action-button"
          >
            PUBLISH
          </Button>
        </div>
      );
    }

    return (
      <div className="mt-3">
        <Button
          variant="contained"
          disabled={activeStepWms === 0}
          onClick={handleBackWms}
          className="action-button mr-2"
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleNextWms(activeStepWms)}
          className="action-button mr-2"
          disabled={!isThisStepCompleted(activeStepWms)}
        >
          Tiếp tục
        </Button>
      </div>
    );
  };

  const RenderBody = () => {
    if (activeStepWms === stepWms.length) {
      return (
        <FinishScreen
          dataSource={dataSource}
          layerSetting={layerSetting}
          handleBack={handleBackWms}
          handleAccept={handleAccept}
        />
      );
    }

    const stepContentWms = isImportShapeFile
      ? activeStepShapeFile
      : isImportTifFile
        ? activeStepTifFile
        : activeStepWms;

    return (
      <div className="setting-step-container">
        <div className="content-container">
          {getStepContentWms(stepContentWms)}
        </div>
        <div className="action-container mt-3 text-right">{RenderButton()}</div>
      </div>
    );
  };

  return (
    <div className="modal-setting-new-layer-container">
      {RenderStepper()}
      {RenderBody()}
    </div>
  );
}
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showLoading: appActions.ShowLoading,
    },
    dispatch
  );
export default connect(null, mapDispatchToProps)(ModalLayerSetting);
