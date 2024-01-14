import React, { Component } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import ControlFunctionopenlayerType from "../../../../components/open-layer/control-function-type/control-function-type";
import { connect } from "react-redux";
import * as InitMapStore from "../../../../redux/store/init-map/init-map.store";
import { bindActionCreators } from "redux";
import * as MaterialComponents from "@material-ui/core";
import ConfirmModalView from "../../../../components/confirm-modal/confirm-modal";
import * as BaseMapAction from "../../../../redux/store/init-map/base-map.store";

//--- Material Control
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import NotificationService from "../../../../common/notification-service";

//--- Material Icon
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import MapIcon from "@material-ui/icons/Map";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";

//--- CSS
import "./baseMap.scss";

class RenderBasemap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openConfirmModal: false,
      indexBaseMapSelected: 0,
      listBaseMapToSelect: [],
      openAddNewBaseMapModal: false,
      baseMapType: "",
      baseMapLabel: "",
      isAddNewBaseMap: true,
      oldBasemapSelected: null,
      hasShowValidate: false,
    };
  }

  getListBasemapNotSelected = (optionAddBasemap = null) => {
    const ListNew = [];
    this.props.listBaseMapDefault.map((baseMapDefault) => {
      let result = true;
      this.props.baseMapData.base_maps.map((baseMapUsed) => {
        if (
          baseMapUsed.baseMapSettingModel.layer_type ===
          baseMapDefault.layer_type
        ) {
          result = false;
          return result;
        }
      });

      if (result) ListNew.push(baseMapDefault);
    });

    if (optionAddBasemap)
      ListNew.push({
        id: optionAddBasemap.baseMapSettingModel.id,
        layer_type: optionAddBasemap.baseMapSettingModel.layer_type,
        name: optionAddBasemap.baseMapSettingModel.name,
        status: optionAddBasemap.baseMapSettingModel.status,
        url: optionAddBasemap.baseMapSettingModel.url,
      });
    this.setState({ listBaseMapToSelect: ListNew });
  };

  onDrop = (event) => {
    const newList = this.props.baseMapData;
    newList["base_maps"].splice(event.removedIndex, 1);
    newList["base_maps"].splice(event.addedIndex, 0, event.payload);
    this.props.UpdateBaseMap({ ...newList });
    // this.props.BaseMapAction.UpdateBaseMap()
    console.log('newlist:', newList)
  };

  getChildPayload = (index) => {
    return this.props.baseMapData["base_maps"][index];
  };

  onClickInput = (indexActive, basemap, event) => {
    const oldBaseMapList = this.props.baseMapData;

    oldBaseMapList["base_maps"].map((baseMap, index) => {
      if (index !== indexActive) baseMap.view_default = false;
      else baseMap.view_default = true;
    });
    const data = oldBaseMapList["base_maps"][indexActive]
    let formData = new FormData();
    formData.append('BaseMapSettingId', data.base_map_setting_id);
    formData.append('Name', data.name);
    formData.append('MapSettingId', oldBaseMapList.id);
    formData.append('Url', data.url);
    formData.append('Id', data.id);
    formData.append('ZIndex', data.z_index);
    formData.append('Ordinal', 0);
    formData.append('ViewDefault', data.view_default);
    !this.props.isLock && this.updateBaseMap(formData)
    this.props.UpdateBaseMap({ ...oldBaseMapList });
    this.props.selectBaseMapFunction(
      ControlFunctionopenlayerType.SelectDisplayBasemap,
      {
        basemap: basemap,
      }
    );
  };

  isBaseMapChecked = (baseMapViewDefault) => {
    if (baseMapViewDefault !== "YES") return false;
    else return true;
  };

  handleClickMapMenu = (event) => {
    this.setState({
      mapMenuFunction: event.currentTarget,
    });
  };

  handleCloseMapMenu = () => {
    this.setState({
      mapMenuFunction: null,
    });
  };

  openAddNewBasemap = (event) => {
    event.stopPropagation();
    this.getListBasemapNotSelected();
    this.setState({
      openAddNewBaseMapModal: true,
      isAddNewBaseMap: true,
      baseMapType: "",
      baseMapLabel: "",
      hasShowValidate: false,
    });
    //console.log(this.props)
  };

  onClickDeleteBasemap = (indexDelete) => {
    const oldBaseMapList = this.props.baseMapData;
    const data = this.props.baseMapData["base_maps"];
    this.deleteBaseMap(data[indexDelete].id);
    oldBaseMapList["base_maps"].splice(indexDelete, 1);
    this.props.UpdateBaseMap({ ...oldBaseMapList });

  };
  deleteBaseMap = (id) => {
    return new Promise((resolve, reject) => {
      BaseMapAction.DeleteBasemap(id).then((res) => {
        resolve(res);
      },
        (err) => {
          reject(err);
        }
      );
    });
  };

  updateBaseMap = (data) => {
    return new Promise((resolve, reject) => {
      BaseMapAction.UpdateBaseMap(data).then((res) => {
        resolve(res);
      },
        (err) => {
          reject(err);
        }
      );
    });
  };

  CreateBaseMap = (data) => {
    return new Promise((resolve, reject) => {
      BaseMapAction.CreateBaseMap(data).then((res) => {
        resolve(res);
      },
        (err) => {
          reject(err);
        }
      );
    });
  };
  onClickOpenEditProperties = (event, baseMap) => {
    event.preventDefault();
    this.getListBasemapNotSelected(baseMap);
    this.setState({
      baseMapType: baseMap.baseMapSettingModel.layer_type,
      baseMapLabel: baseMap.name,
      isAddNewBaseMap: false,
      openAddNewBaseMapModal: true,
      oldBasemapSelected: baseMap,
      hasShowValidate: false,
    });
  };

  handleAcceptBasemapPopup = () => {
    if (this.state.baseMapLabel.trim() === "") {
      this.setState({
        hasShowValidate: true,
      });
      return;
    }
    let BasemapSelected = null;
    const OldListBasemap = this.props.baseMapData;
    this.props.listBaseMapDefault.map((basemap) => {
      if (basemap.layer_type === this.state.baseMapType) {
        BasemapSelected = basemap;
        return;
      }

      console.log(OldListBasemap)

    });
    let BasemapSelect = null;
    const listBaseMap = OldListBasemap.base_maps;
    console.log(listBaseMap)
    listBaseMap.map((item) => {
      if (item.baseMapSettingModel.layer_type === this.state.baseMapType) {
        BasemapSelect = item;
        return;
      }
    })
    console.log(BasemapSelect)

    if (BasemapSelected) {
      if (this.state.isAddNewBaseMap) {
        let formData = new FormData();
        formData.append('BaseMapSettingId', BasemapSelected.id);
        formData.append('Name', this.state.baseMapLabel);
        formData.append('MapSettingId', OldListBasemap.id);
        formData.append('Url', BasemapSelected.url);
        formData.append('ZIndex', 0);
        formData.append('Ordinal', 0);
        formData.append('ViewDefault', false);
        this.CreateBaseMap(formData).then((res) => {
          if(res.content) {
            OldListBasemap.base_maps.push({
              base_map_setting_id: BasemapSelected.id,
              id: res.content.id,
              map_setting_id: OldListBasemap.id,
              name: this.state.baseMapLabel,
              url: BasemapSelected.url,
              view_default: false,
              z_index: 0,
              baseMapSettingModel: {
                id: BasemapSelected.id,
                layer_type: this.state.baseMapType,
                name: BasemapSelected.name,
                status: false,
                url: BasemapSelected.url,
              },
            });
            this.props.UpdateBaseMap({ ...OldListBasemap });
          }
          
        });
      } else {
        OldListBasemap.base_maps.map((basemap) => {
          if (
            basemap.baseMapSettingModel.layer_type ===
            this.state.oldBasemapSelected.baseMapSettingModel.layer_type
          ) {
            basemap.name = this.state.baseMapLabel;
            basemap.url = BasemapSelected.url;
            basemap.baseMapSettingModel["id"] = BasemapSelected.id;
            basemap.baseMapSettingModel["layer_type"] =
              BasemapSelected.layer_type;
            basemap.baseMapSettingModel["url"] = BasemapSelected.url;
            basemap.baseMapSettingModel["name"] = BasemapSelected.name;
            basemap.base_map_setting_id = BasemapSelected.id;
            let formData = new FormData();
            formData.append('BaseMapSettingId', BasemapSelected.id);
            formData.append('Name', this.state.baseMapLabel);
            formData.append('MapSettingId', OldListBasemap.id);
            formData.append('Url', BasemapSelected.url);
            formData.append('Id', BasemapSelect.id);
            formData.append('ZIndex', 0);
            formData.append('Ordinal', 0);
            formData.append('ViewDefault', false);
            this.updateBaseMap(formData).then(res => {
              NotificationService.success("Cập nhật thành công");
            });
          }
        });
      }
    }
    console.log(OldListBasemap)
    this.setState({
      openAddNewBaseMapModal: false,
      hasShowValidate: false,
    });
    this.props.UpdateBaseMap({ ...OldListBasemap });
  };

  openConfirmDeleteBaseMap = (event, index) => {
    event.preventDefault();
    this.setState({
      openConfirmModal: true,
      indexBaseMapSelected: index,
    });
  };

  render() {
    return (
      <div className="left-control-base-map-container mt-2">
        <Accordion>
          <AccordionSummary
            aria-controls="additional-actions1-content"
            id="additional-actions1-header"
            className="position-relative base-map-header-summary"
          >
            <div className="row w-100 no-gutters align-items-center">
              <div className="col-6 font-base-map">
                <MapIcon className="text-success mr-1" /> Bản đồ nền
              </div>
              {!this.props.isLock && (
                <div className="col-6 text-right">
                  <MaterialComponents.Tooltip title="Thêm bản đồ nền">
                    <MaterialComponents.IconButton
                      onClick={(event) => this.openAddNewBasemap(event)}
                    >
                      <AddCircleIcon fontSize="small" className="text-success" />
                    </MaterialComponents.IconButton>
                  </MaterialComponents.Tooltip>
                </div>
              )}
            </div>
          </AccordionSummary>
          <AccordionDetails className="d-block">
            <Divider className="mb-2" />

            {this.props.baseMapData.haveData &&
              this.props.baseMapData.base_maps.length === 0 && (
                <span>Chưa có bản đồ nền nào được chọn</span>
              )}

            <Container
              getChildPayload={this.getChildPayload}
              onDrop={this.onDrop}
              dragClass="drag-state-custom-ddb"
            >
              {this.props.baseMapData.haveData &&
                this.props.baseMapData.base_maps.map((baseMap, index) => (
                  <Draggable key={index}>
                    <div
                      className="row w-100 p-0 m-0"
                      style={{ alignItems: "baseline" }}
                    >
                      <label className="col-8 m-0 p-0 pt-2 pb-2">
                        <input
                          type="radio"
                          checked={baseMap.view_default}
                          className="mr-2"
                          name="left-control-base-map"
                          onChange={() => { }}
                          onClick={() => this.onClickInput(index, baseMap)}
                        />
                        {baseMap.name}
                      </label>
                      {!this.props.isLock && (
                        <div className="col-4 m-0 p-0 text-right">
                          <MaterialComponents.Tooltip title="Cài đặt">
                            <MaterialComponents.IconButton
                              onClick={(event) =>
                                this.onClickOpenEditProperties(event, baseMap)
                              }
                            >
                              <EditIcon
                                color="primary"
                                fontSize="small"
                                className="setting-child-base-map"
                              />
                            </MaterialComponents.IconButton>
                          </MaterialComponents.Tooltip>
                          <MaterialComponents.Tooltip title="Xóa">
                            <MaterialComponents.IconButton
                              onClick={(event) =>
                                this.openConfirmDeleteBaseMap(event, index)
                              }
                            >
                              <DeleteIcon color="error" fontSize="small" />
                            </MaterialComponents.IconButton>
                          </MaterialComponents.Tooltip>
                        </div>
                      )}
                    </div>
                  </Draggable>
                ))}
            </Container>
          </AccordionDetails>
        </Accordion>

        {/* add base map */}
        <Dialog
          maxWidth="sm"
          fullWidth={true}
          onClose={() => this.setState({ openAddNewBaseMapModal: false })}
          aria-labelledby="base-map-add-alert-dialog-title"
          aria-describedby="alert-dialog-description"
          id="dialog-create-base-map"
          open={this.state.openAddNewBaseMapModal}
        >
          <DialogTitle
            id="base-map-add-alert-dialog-title"
            onClose={() => this.setState({ openAddNewBaseMapModal: false })}
            className="border-bottom"
          >
            {this.state.isAddNewBaseMap ? "Thêm lớp nền" : "Thiết lập"}
          </DialogTitle>

          <DialogContent className="pt-4 pb-2">
            <div className="form-group">
              <InputLabel>Tên lớp nền</InputLabel>
              <TextField
                value={this.state.baseMapLabel}
                onChange={(event) =>
                  this.setState({ baseMapLabel: event.target.value })
                }
                fullWidth
              />
              {this.state.hasShowValidate &&
                this.state.baseMapLabel.trim() === "" && (
                  <span className="warning-validate-style-custom d-inline-block mb-2">
                    Không được bỏ trống trường này
                  </span>
                )}
            </div>

            <div className="form-group">
              <InputLabel id="select-base-type-select-label" className="mt-3">
                Loại nền
              </InputLabel>
              <Select
                className="w-100"
                labelId="select-base-type-select-label"
                id="setiing-base-map-type"
                value={this.state.baseMapType}
                onChange={(event) =>
                  this.setState({ baseMapType: event.target.value })
                }
              >
                {this.state.listBaseMapToSelect.map((basemap, index) => (
                  <MenuItem key={index} value={basemap.layer_type}>
                    {basemap.name}
                  </MenuItem>
                ))}
              </Select>
              {this.state.hasShowValidate && !this.state.baseMapType && (
                <span className="warning-validate-style-custom d-inline-block mb-2">
                  Không được bỏ trống trường này
                </span>
              )}
            </div>
          </DialogContent>

          <DialogActions className="border-top">
            <Button
              onClick={() => this.setState({ openAddNewBaseMapModal: false })}
              variant="contained"
              startIcon={<CloseIcon />}
            >
              Hủy
            </Button>
            <Button
              onClick={() => this.handleAcceptBasemapPopup()}
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
            >
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
        {/* Confirm modal */}
        <ConfirmModalView
          open={this.state.openConfirmModal}
          handleClose={() => this.setState({ openConfirmModal: false })}
          title="Xóa base map"
          handleAccept={() =>
            this.onClickDeleteBasemap(this.state.indexBaseMapSelected)
          }
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  baseMapData: state.initMap.baseMaps,
  listBaseMapDefault: state.initMap.listBaseMapDefault,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      UpdateBaseMap: InitMapStore.UpdateBaseMap,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(RenderBasemap);
