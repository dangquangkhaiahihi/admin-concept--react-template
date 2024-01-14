import React, { useEffect } from "react";
import "./map-tools-panel.scss";
import Vilanguage from "../../../language/vi";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as MapToolsPanelsStore from "../../../redux/store/openlayer/map-tools-panels.store";

const LanguageCollect = Vilanguage;

const mockFunction = () => {
  // console.log("Run")
};

function MapToolsPanel(props) {
  const { map } = props;

  const zoomIn = () => {
    map.getView().setZoom(map.getView().getZoom() + 1);
  };

  const zoomOut = () => {
    map.getView().setZoom(map.getView().getZoom() - 1);
  };

  useEffect(() => {
    const ListButton = Array.from(
      document.getElementsByClassName("tool-button")
    );
    ListButton.map((Button, index) => {
      Button.addEventListener("click", () =>
        handleChangeClassStateButton(index)
      );
    });
  }, [props]);

  function handleChangeClassStateButton(indexActive) {
    const ListButton = Array.from(
      document.getElementsByClassName("tool-button")
    );
    ListButton.map((Button, index) => {
      if (indexActive != index) Button.classList.remove("active");
      else Button.classList.add("active");
    });
  }
  const listTools = [
    {
      title: LanguageCollect.planningMapView.mapToolsPanel.viewObjectInfomation,
      action: mockFunction,
      icon: "info",
    },
    {
      title: LanguageCollect.planningMapView.mapToolsPanel.toggleFullScreen,
      action: mockFunction,
      icon: "full-screen",
    },
    {
      title: LanguageCollect.planningMapView.mapToolsPanel.zoomIn,
      action: zoomIn,
      icon: "zoomIn",
    },
    {
      title: LanguageCollect.planningMapView.mapToolsPanel.zoomOut,
      action: zoomOut,
      icon: "zoomOut",
    },
    {
      title: LanguageCollect.planningMapView.mapToolsPanel.filterInfomation,
      action: () => props.SetDisplayInfomationPopup(true),
      icon: "filter",
    },
    {
      title: LanguageCollect.planningMapView.mapToolsPanel.mapLegend,
      action: mockFunction,
      icon: "layers",
    },
    {
      title: LanguageCollect.planningMapView.mapToolsPanel.selectAnObject,
      action: mockFunction,
      icon: "selectOne",
    },
    {
      title: LanguageCollect.planningMapView.mapToolsPanel.selectMultiObject,
      action: mockFunction,
      icon: "selectArea",
    },
    {
      title: LanguageCollect.planningMapView.mapToolsPanel.measuareArea,
      action: mockFunction,
      icon: "measureArea",
    },
    {
      title: LanguageCollect.planningMapView.mapToolsPanel.measuareDistance,
      action: mockFunction,
      icon: "ruler",
    },
    {
      title: LanguageCollect.planningMapView.mapToolsPanel.moveViewport,
      action: mockFunction,
      icon: "finger",
    },
    {
      title: LanguageCollect.planningMapView.mapToolsPanel.printTheMap,
      action: mockFunction,
      icon: "print",
    },
    {
      title: LanguageCollect.planningMapView.mapToolsPanel.myPosition,
      action: mockFunction,
      icon: "position",
    },
    {
      title: LanguageCollect.planningMapView.mapToolsPanel.exportMap,
      action: mockFunction,
      icon: "photo",
    },
    {
      title: LanguageCollect.planningMapView.mapToolsPanel.compare,
      action: mockFunction,
      icon: "slideshow",
    },
    {
      title: LanguageCollect.planningMapView.mapToolsPanel.locationMarker,
      action: mockFunction,
      icon: "marker",
    },
  ];
  return props.isDisplayPanel ? (
    <div className="d-flex position-absolute map-tool-panel-container">
      {listTools.map((Tool, index) => (
        <RenderButtonTool key={index} data={Tool} />
      ))}
    </div>
  ) : null;
}

function RenderButtonTool(props) {
  const data = props.data;
  return (
    <div>
      <button className="tool-button" onClick={() => data.action()}>
        <img
          src={require(`../../../assets/icon/${data.icon}.svg`)}
          title={data.title}
          alt={data.title}
        />
      </button>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isDisplayPanel: true,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      SetDisplayInfomationPopup: MapToolsPanelsStore.SetDisplayInfomationPopup,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(MapToolsPanel);
