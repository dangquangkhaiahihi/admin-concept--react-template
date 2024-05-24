import { Card, CardContent, TextField, Tooltip } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./function-button.scss";
import { connect } from "react-redux";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import Polygon from "ol/geom/Polygon";
import LineString from "ol/geom/LineString";
import Draw from "ol/interaction/Draw";
import { unByKey } from "ol/Observable";
import domtoimage from "dom-to-image-more";
import { Overlay } from "ol";
import { getArea, getLength } from "ol/sphere";
import DragBox from "ol/interaction/DragBox";
import { Autocomplete } from "@material-ui/lab";
import {
  AddLabelValueToListLayers,
  ConvertColsDataDetailViewToStandardData,
  Highlight_Feature_Style,
  VectorImageLayerClassName,
} from "../config/config";
import PopupPrint from "./popup/popup-print";
import CloseIcon from "@material-ui/icons/Close";
import Jquery from "jquery";
import GeoJSON from "ol/format/GeoJSON";
import TileLayer from "ol/layer/Tile";
import VectorImageLayer from "ol/layer/VectorImage";
import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";

var sketchGolbal;
var helpTooltipElementGolbal;
var helpTooltipGolbal;
var measureTooltipElementGolbal;
var measureTooltipGolbal;
var drawMeasureGolbal;

var selected = null;
var select = null;
var selectClick = new Select({
  condition: click,
  style: Highlight_Feature_Style,
});

var isEnable = true;

function FunctionButton(props) {
  const [map, setMap] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenOpacity, setOpenOpacity] = useState();
  const [valueSelect, setValueSelect] = useState();
  const [listCategories, setListCategories] = useState([]);

  const [layer, setLayer] = useState();
  const [listLayers, setListLayers] = useState([]);
  const [urlImage, setUrlImage] = useState([]);
  const [isLoadedAllVectorSource, setIsLoadedAllVectorSource] = useState(false);
  const [dataItems, setDataItem] = useState();
  const [isFist, setIsFist] = useState(false);

  useEffect(() => {
    if (props.mapLayer) {
      setMap(props.mapLayer);
    }
    let listCategoriesTemp = [];
    props.layers.layer_categories.map((item) => {
      item.layer_settings.map((i) => {
        listCategoriesTemp.push(i);
      });
    });

    setValueSelect(listCategoriesTemp[0]);
    let layers = AddLabelValueToListLayers(listCategoriesTemp);
    setLayer(layers[0]);
    setListLayers(layers);
    setListCategories(listCategoriesTemp);
    setIsLoadedAllVectorSource(!layers.length);
    const ListButton = Array.from(
      document.getElementsByClassName("tool-button")
    );
    ListButton.map((Button, index) => {
      Button.addEventListener("click", () =>
        handleChangeClassStateButton(index)
      );
    });
    if (ListButton[0]) ListButton[0].classList.add("active");
  }, []);

  useEffect(() => {
    if (isFist) {
      handleOnOffViewInfomation(false);
      removeHiglightVectorLayer();
      handleMeasureMode(false, false);
    }
    setIsFist(true);
  }, [props.layers]);

  function handleChangeClassStateButton(indexActive) {
    const ListButton = Array.from(
      document.getElementsByClassName("tool-button")
    );
    ListButton.map((Button, index) => {
      if (indexActive !== index) Button.classList.remove("active");
      else {
        // if (index === 2 || index === 3) {
        //   ListButton[1].classList.add("disable");
        // } else {
        //   ListButton[1].classList.remove("disable");
        // }
        Button.classList.add("active");
      }
    });
  }

  const listTools = [
    {
      title: "Di chuyển bản đồ",
      action: () => moveViewReport(),
      icon: "finger",
    },
    {
      title: "Chọn một đối tượng",
      action: () => selectOne(),
      icon: "selectOne",
    },
    {
      title: "Đo khoảng cách",
      action: () => turnOnMeasureLineMode(),
      icon: "ruler",
    },
    {
      title: "Đo diện tích",
      action: () => turnOnMeasurePolygonMode(),
      icon: "measureArea",
    },
    {
      title: "Làm mờ",
      action: () => makeOpacityMap(),
      icon: "sliders",
    },
    {
      title: "In bản đồ",
      action: () => handlePrint(),
      icon: "print",
    },
    {
      title: "Xuất bản đồ",
      action: () => handleExportMap(true),
      icon: "photo",
    },
  ];

  const selectOne = () => {
    isEnable = true;
    handleMeasureMode(false, false);
    removeInteractionOnMap();
    handleOnOffViewInfomation(true);
  };

  const handleOnOffViewInfomation = (isTurnOn) => {
    const mapObject = map;
    if (isTurnOn) {
      mapObject.on("singleclick", functionClickViewInfomationListener);
    } else {
      mapObject.un("singleclick", functionClickViewInfomationListener);
      unByKey("singleclick");
      mapObject.removeEventListener("singleclick");
    }
    changeInteraction();
  };

  const changeInteraction = () => {
    if (!isLoadedAllVectorSource)
      if (select !== null) {
        map.removeInteraction(select);
      }
    select = selectClick;
    if (select !== null) {
      map.addInteraction(select);
    }
  };

  // const handleForListLayers = () => {
  //   let listCategoriesTemp = [];
  //   props.layers.layer_categories.map((item) => {
  //     item.layer_settings.map((i) => {
  //       listCategoriesTemp.push(i);
  //     });
  //   });

  //   setValueSelect(listCategoriesTemp[0]);
  //   let layers = AddLabelValueToListLayers(listCategoriesTemp);
  //   setLayer(layers[0]);
  //   setListLayers(layers);
  //   setListCategories(listCategoriesTemp);
  // };

  const functionClickViewInfomationListener = (evt) => {
    if (isEnable) {
      //handleForListLayers()
      let listCategoriesTemp = [];
      props.layers.layer_categories.map((item) => {
        item.layer_settings.map((i) => {
          listCategoriesTemp.push(i);
        });
      });

      setValueSelect(listCategoriesTemp[0]);
      let layers = AddLabelValueToListLayers(listCategoriesTemp);

      const mapObject = map;
      const listLayer = mapObject.getLayers();
      const listTitleLayerVisible = [];
      const listVectorImageLayerVisible = [];
      const view = mapObject.getView();
      const viewResolution = view.getResolution();
      let layerIndex = 0;
      console.log("CLick to map and view info");
      const getFeaturesWithTitleLayer = (titleLayer) => {
        //console.log('titleLayer_xxx',titleLayer);
        const source = titleLayer.getSource();
        const layerId = source.getParams()["LayerId"];
        const currentLayerSettingModel = layers.filter(
          (x) => x.id === layerId
        )[0];
        const url = source.getFeatureInfoUrl(
          evt.coordinate,
          viewResolution,
          view.getProjection(),
          { INFO_FORMAT: "application/json", FEATURE_COUNT: 50 }
        );

        if (url) {
          Jquery.ajax({
            type: "POST",
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (featureCollection) => {
              if (featureCollection.features.length > 0) {
                const _geojsonObject = featureCollection;
                const ListInfoMation = [];

                /*
                 * Lay thong tin de hien len bang thuoc tinh ben tay trai
                 * */

                const setDataForTabInformation = (featuresProperies) => {
                  if (currentLayerSettingModel) {
                    const layerSettingModel = currentLayerSettingModel;
                    const colsRaw = ConvertColsDataDetailViewToStandardData(
                      layerSettingModel.displayName.cols
                    );
                    const displayDetails =
                      layerSettingModel.displayName.viewdetail;
                    //console.log('displayDetails',displayDetails);
                    if (displayDetails.use) {
                      console.log("displayDetails", displayDetails);
                      displayDetails.cols.map((columnName) => {
                        ListInfoMation.push({
                          variable: columnName,
                          label: colsRaw[columnName],
                          value: featuresProperies[columnName],
                        });
                      });
                      
                      var info = {
                        table: currentLayerSettingModel.table,
                        gid: _geojsonObject.features[0].id.split(".").pop(),
                        listInfo: ListInfoMation,
                      };

                      console.log(info);

                      setDataItem(ListInfoMation);
                      props.handleGetDataClick(info);
                    }
                  }
                };

                // n.features.map(features => MergeData(features.properties))
                console.log("featureCollection__xxx", featureCollection);
                setDataForTabInformation(
                  featureCollection.features[0].properties
                );

                /********************************************************************/

                //this.props.SaveInfomationList(ListInfoMation);
                if (!isLoadedAllVectorSource) {
                  let _isHaveHighlightVectorlayer = false;
                  listLayer.forEach((_layer) => {
                    if (
                      _layer instanceof VectorLayer &&
                      _layer.getClassName() === "highlight-vectorlayer"
                    ) {
                      _isHaveHighlightVectorlayer = true;
                      const _newVectorSource = new VectorSource({
                        features: new GeoJSON().readFeatures(_geojsonObject),
                      });
                      _layer.setSource(_newVectorSource);
                    }
                  });
                  console.log(
                    "_isHaveHighlightVectorlayer",
                    _isHaveHighlightVectorlayer
                  );
                  if (!_isHaveHighlightVectorlayer) {
                    console.log("_geojsonObject", _geojsonObject);
                    listLayer.push(
                      new VectorLayer({
                        className: "highlight-vectorlayer",
                        source: new VectorSource({
                          features: new GeoJSON().readFeatures(_geojsonObject),
                        }),
                        zIndex: 999,
                        style: new Style({
                          stroke: new Stroke({
                            color: "rgba(0,230,241,1)",
                            width: 1,
                          }),
                          fill: new Fill({
                            color: "rgba(223,16, 188,1)",
                          }),
                        }),
                      })
                    );
                  }
                }
              } else {
                removeHiglightVectorLayer();
                layerIndex++;
                if (layerIndex < listTitleLayerVisible.length) {
                  getFeaturesWithTitleLayer(listTitleLayerVisible[layerIndex]);
                }
              }
            },
          });
        }
      };
      listLayer.forEach((layer) => {
        if (
          layer instanceof TileLayer &&
          layer.getClassName() != "ol-layer" &&
          layer.getVisible()
        )
          listTitleLayerVisible.push(layer);

        if (layer instanceof VectorImageLayer && layer.getVisible())
          listVectorImageLayerVisible.push(layer);
      });
      listTitleLayerVisible.reverse();
      listVectorImageLayerVisible.reverse();
      listTitleLayerVisible.sort((a, b) => b.getZIndex() - a.getZIndex());
      if (listTitleLayerVisible.length > 0) {
        getFeaturesWithTitleLayer(listTitleLayerVisible[layerIndex]);
      }
    }
  };

  const removeHiglightVectorLayer = () => {
    const _objectMap = map;
    if (!_objectMap) return;
    const _layers = _objectMap.getLayers();
    let _indexDelete = -1;
    _layers.getArray().map((_layer, _index) => {
      if (
        _layer instanceof VectorLayer &&
        _layer.getClassName() === "highlight-vectorlayer"
      ) {
        _indexDelete = _index;
        return;
      }
    });
    if (_indexDelete != -1) _layers.removeAt(_indexDelete);
  };

  const turnOnMeasureLineMode = () => {
    // isTurnOnMeasureMode.current = false;
    // autoTurnOffAllFeature();
    isEnable = false;
    handleOnOffViewInfomation(false);
    removeHiglightVectorLayer();
    handleMeasureMode(false, false);
    removeInteractionOnMap();
    handleMeasureMode(true, true);
    // isTurnOnMeasureMode.current = true;
  };

  const turnOnMeasurePolygonMode = () => {
    // isTurnOnMeasureMode.current = false;
    // autoTurnOffAllFeature();
    isEnable = false;
    handleOnOffViewInfomation(false);
    removeHiglightVectorLayer();
    handleMeasureMode(false, false);
    removeInteractionOnMap();
    handleMeasureMode(true, false);
    // isTurnOnMeasureMode.current = true;
  };

  const moveViewReport = () => {
    isEnable = false;
    handleOnOffViewInfomation(false);
    removeHiglightVectorLayer();
    handleMeasureMode(false, false);
    removeInteractionOnMap();
  };

  const removeInteractionOnMap = () => {
    let interactionArr = map.getInteractions().array_;
    let length = interactionArr.length;
    if (interactionArr && length === 0) return;
    interactionArr.map((item, index) => {
      if (item instanceof DragBox) {
        map.getInteractions().array_.splice(index, 1);
      }
    });
  };

  const makeOpacityMap = () => {
    isEnable = false;
    removeHiglightVectorLayer();
    handleMeasureMode(false, false);
    removeInteractionOnMap();
    setOpenOpacity(true);
  };

  const handlePrint = () => {
    setIsOpen(true);
    handleExportMap(false);
  };

  const handleExportMap = (isSave) => {
    handleMeasureMode(false, false);
    removeInteractionOnMap();
    const _openlayerMapObject = map;
    const _size = _openlayerMapObject.getSize();
    const _exportOptions = {
      width: _size[0],
      height: _size[1],
      filter: function (_element) {
        const _className = _element.className || "";
        return (
          _className.indexOf("ol-control") === -1 ||
          _className.indexOf("ol-scale") > -1 ||
          (_className.indexOf("ol-attribution") > -1 &&
            _className.indexOf("ol-uncollapsible"))
        );
      },
    };

    domtoimage
      .toJpeg(_openlayerMapObject.getViewport(), _exportOptions)
      .then(function (dataUrl) {
        if (isSave) {
          let _linkElement = document.createElement("a");
          _linkElement.setAttribute("download", `map.jpg`);
          _linkElement.setAttribute("href", dataUrl);
          _linkElement.click();
        } else {
          setUrlImage(dataUrl);
        }
        // document.querySelector('[class="tool-button"]').click();
      });

    handleChangeClassStateButton(0);
  };

  const handleMeasureMode = (isTurnOn, isLineMode) => {
    const LayersCurrents = map.getLayers();
    let indexMeasureLayer = -1;
    let isLayerHasExist = false;
    LayersCurrents.forEach((layerObject, index) => {
      if (layerObject.getClassName() === "measuare-vector-layer") {
        isLayerHasExist = true;
        indexMeasureLayer = index;
        return;
      }
    });
    if (isTurnOn) {
      let measureVectorSource = new VectorSource();
      if (!isLayerHasExist) {
        const measureVectorLayer = new VectorLayer({
          zIndex: 1000,
          className: "measuare-vector-layer",
          source: measureVectorSource,
          style: new Style({
            fill: new Fill({
              color: "rgba(255, 0, 0, 0.6)",
            }),
            stroke: new Stroke({
              color: "#ffcc33",
              width: 3,
            }),
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: "#ffcc33",
              }),
            }),
          }),
        });
        LayersCurrents.push(measureVectorLayer);
        map.on("pointermove", functionPointerMoveHandle_MeasureMode);
        map
          .getViewport()
          .addEventListener("mouseout", functionMouseOut_MeasureMode);
      } else {
        const MeasureVectorLayer = LayersCurrents?.item(indexMeasureLayer);
        measureVectorSource = MeasureVectorLayer.getSource();
      }
      map.removeInteraction(drawMeasureGolbal);
      functionAddInteraction_MeasureMode(isLineMode, measureVectorSource);
    } else {
      map.removeInteraction(drawMeasureGolbal);
      functionRemoveAllMapOverlay();
      //map.un("pointermove", functionPointerMoveHandle_MeasureMode());
      map
        .getViewport()
        .removeEventListener("mouseout", functionMouseOut_MeasureMode());
      if (indexMeasureLayer !== -1) LayersCurrents.removeAt(indexMeasureLayer);
    }
  };

  const functionRemoveAllMapOverlay = () => {
    const CollectsOfOverlay = map.getOverlays();
    CollectsOfOverlay.clear();
  };

  const functionPointerMoveHandle_MeasureMode = (event) => {
    if (event && event.dragging) return;
    if (sketchGolbal) {
      const geom = sketchGolbal.getGeometry();
      if (geom instanceof Polygon) {
      } else if (geom instanceof LineString) {
      }
    }
    if (helpTooltipElementGolbal) {
      if (event && event.coordinate) {
        helpTooltipGolbal.setPosition(event.coordinate);
      }
      helpTooltipElementGolbal.classList.remove("hidden");
    }
  };

  const functionMouseOut_MeasureMode = () => {
    if (helpTooltipElementGolbal) {
      helpTooltipElementGolbal.classList.add("hidden");
    }
  };

  const functionAddInteraction_MeasureMode = (isLineMode, vectorSource) => {
    let type = isLineMode ? "LineString" : "Polygon";
    drawMeasureGolbal = new Draw({
      source: vectorSource,
      type: type,
      style: new Style({
        fill: new Fill({
          color: "rgba(234, 255, 0,0.5)",
        }),
        stroke: new Stroke({
          color: "rgba(255, 0, 0, 0.8);",
          // lineDash: [10, 10],
          width: 3,
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: "rgba(255,0,0,0.3);",
          }),
          fill: new Fill({
            color: "rgba(29, 32, 232,1)",
          }),
        }),
      }),
    });
    map.addInteraction(drawMeasureGolbal);

    functionCreateMeasureTooltip_MeasureMode();
    functionCreateHelpTooltip_MeasureMode();

    let listener;
    drawMeasureGolbal.on("drawstart", (evt) => {
      sketchGolbal = evt.feature;

      let tooltipCoord = evt.coordinate;

      listener = sketchGolbal?.getGeometry().on("change", function (evt) {
        const geom = evt.target;
        let output;
        if (geom instanceof Polygon) {
          output = functionFormatPolygon_MeasureMode(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof LineString) {
          output = functionFormatLength_MeasureMode(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        if (measureTooltipElementGolbal)
          measureTooltipElementGolbal.innerHTML = output || "";
        measureTooltipGolbal.setPosition(tooltipCoord);
      });
    });

    drawMeasureGolbal.on("drawend", function () {
      if (measureTooltipElementGolbal)
        measureTooltipElementGolbal.className = "ol-tooltip ol-tooltip-static";
      measureTooltipGolbal.setOffset([0, -7]);
      sketchGolbal = null;
      measureTooltipElementGolbal = null;
      functionCreateMeasureTooltip_MeasureMode();
      unByKey(listener);
    });
  };

  const functionCreateHelpTooltip_MeasureMode = () => {
    if (helpTooltipElementGolbal) {
      if (helpTooltipElementGolbal.parentNode) {
        helpTooltipElementGolbal.parentNode.removeChild(
          helpTooltipElementGolbal
        );
      }
    }
    helpTooltipElementGolbal = document.createElement("div");
    helpTooltipElementGolbal.className = "ol-tooltip hidden";
    const positioning = "center-left";
    helpTooltipGolbal = new Overlay({
      element: helpTooltipElementGolbal,
      offset: [15, 0],
      positioning: positioning,
    });
    map.addOverlay(helpTooltipGolbal);
  };

  const functionCreateMeasureTooltip_MeasureMode = () => {
    if (measureTooltipElementGolbal) {
      if (measureTooltipElementGolbal.parentNode) {
        measureTooltipElementGolbal.parentNode.removeChild(
          measureTooltipElementGolbal
        );
      }
    }

    measureTooltipElementGolbal = document.createElement("div");
    measureTooltipElementGolbal.className = "ol-tooltip ol-tooltip-measure";
    const positioning = "bottom-center";
    measureTooltipGolbal = new Overlay({
      element: measureTooltipElementGolbal,
      offset: [0, -15],
      positioning: positioning,
    });
    map.addOverlay(measureTooltipGolbal);
  };

  const functionFormatLength_MeasureMode = (line) => {
    const length = getLength(line, {
      projection: "EPSG:4326",
    });
    let result = "";
    if (length > 100) {
      result = Math.round((length / 1000) * 100) / 100 + " " + "km";
    } else {
      result = Math.round(length * 100) / 100 + " " + "m";
    }

    return result;
  };

  const functionFormatPolygon_MeasureMode = (polygon) => {
    const area = getArea(polygon, {
      projection: "EPSG:4326",
    });
    let result = "";
    if (area > 10000) {
      result =
        Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
    } else {
      result = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
    }
    return result;
  };

  const handleClose = () => {
    setOpenOpacity(false);
    // move to handle move
    handleChangeClassStateButton(0);
    setValueSelect("");
  };

  // change value select
  const handleChange = (value) => {
    setValueSelect(value);
  };

  const handleChangeOpacityOfCurrentLayer = (event) => {
    let data = {
      ...valueSelect,
      opacity: event.target.value,
    };
     console.log('valueSelect',valueSelect)
    console.log('listLayers',listLayers) 
    console.log('data',data) 
    let dataList = listLayers.map((item) => {
      if (item.value === data.value) {
        item.opacity = data.opacity;
      }
      return item;
    });
    let opacity = Number(data.opacity) / 100;
    changeCurrentLayerOpacity(opacity, data);
    setListLayers(dataList);
    setLayer(data);
  };

  const changeCurrentLayerOpacity = (opacity, layer) => {
    if (opacity) {
      if (layer) toggleDisplayLayer(layer, opacity);
    }
  };

  const toggleDisplayLayer = (layer, opacity) => {
    const LayersCurrents = map.getLayers();
    for(let i =0 ;i < LayersCurrents.array_.length; i++){
      if(LayersCurrents.array_[i].values_.source.params_!==undefined){
        if(LayersCurrents.array_[i].values_.source.params_.LAYERS === layer.table)
        {
          LayersCurrents.array_[i].setVisible(layer.is_check);
          LayersCurrents.array_[i].setOpacity(1);
        }
        else
        {
          LayersCurrents.array_[i].setOpacity(opacity);
        }
      }
    }
  };

  const handleClosePopup = (value) => {
    setIsOpen(value);
  };

  return (
    <>
      <div className="container-buttons">
        {listTools &&
          listTools.map((item, index) => (
            <Tooltip title={item.title} placement="left-start">
              <button className="tool-button" key={index} onClick={item.action}>
                <img
                  src={require(`../../../assets/icon/${item.icon}.svg`)}
                  alt={item.title}
                />
              </button>
            </Tooltip>
          ))}

        {/* for opacity */}
        {isOpenOpacity && listCategories.length > 0 && (
          <Card sx={{ minWidth: 300 }} className="opacity">
            <CardContent>
              <div className="opacity_header">
                <button className="button-close" onClick={handleClose}>
                  <CloseIcon />
                </button>
              </div>
              <div className="opacity-content">
                <Autocomplete
                  options={listCategories}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.name
                  }
                  value={valueSelect}
                  onChange={(event, newValue) => {
                    handleChange(newValue);
                  }}
                  disableClearable={true}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn lớp cơ sở"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </div>

              <input
                id="ranger-input-current-layer"
                onChange={handleChangeOpacityOfCurrentLayer}
                className="w-100 opacity-range-control"
                type="range"
                value={layer.opacity}
                min="0"
                max="100"
              />
            </CardContent>
          </Card>
        )}

        {/* for popup */}
        {isOpen && (
          <PopupPrint
            isOpen={isOpen}
            urlImage={urlImage}
            planningName={props.planningName}
            handleClosePopup={handleClosePopup}
            listInfoMation={dataItems}
          />
        )}
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  mapSetting: state.initMap.mapSetting,
  baseMaps: state.initMap.baseMaps,
  layers: state.initMap.layers,
});

export default connect(mapStateToProps)(FunctionButton);
