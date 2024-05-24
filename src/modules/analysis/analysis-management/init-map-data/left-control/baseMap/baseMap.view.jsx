import React, { Component } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { connect } from "react-redux";
import * as InitMapStore from "../../../../../../redux/store/init-map/init-map.store";
import { bindActionCreators } from "redux";
import * as MaterialComponents from "@material-ui/core";

//--- Material Control
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Divider from "@material-ui/core/Divider";


//--- Material Icon
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import MapIcon from "@material-ui/icons/Map";
import EditIcon from "@material-ui/icons/Edit";


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
    //const data = oldBaseMapList["base_maps"][indexActive]
    //!this.props.isLock && this.updateBaseMap(formData)
    this.props.UpdateBaseMap({ ...oldBaseMapList });
    console.log("oldBaseMapList",oldBaseMapList)
    this.props.selectBaseMapFunction(
      "select-base-map",
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
                    </div>
                  </Draggable>
                ))}
            </Container>
          </AccordionDetails>
        </Accordion>

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
