import { unByKey } from "ol/Observable";
import Jquery from "jquery";
import { ConvertColsDataDetailViewToStandardData } from "../config/config";
import TileLayer from "ol/layer/Tile";
import VectorImageLayer from "ol/layer/VectorImage";
export const handleOnOffViewInfomation = (isTurnOn, map) => {
  const mapObject = map;
  if (isTurnOn) {
    mapObject.on("singleclick", functionClickViewInfomationListener);
  } else {
    mapObject.un("singleclick", functionClickViewInfomationListener);
    unByKey("singleclick");
    mapObject.removeEventListener("singleclick");
  }
  //changeInteraction();
};

const functionClickViewInfomationListener = (evt, isEnable, map, listLayers) => {
    if (isEnable) {
      const mapObject = map;
      if(mapObject){
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
          const currentLayerSettingModel = listLayers.filter(
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
                        displayDetails.cols.map((columnName) => {
                          ListInfoMation.push({
                            label: colsRaw[columnName],
                            value: featuresProperies[columnName],
                          });
                        });
                        // console.log(ListInfoMation)
                        // setDataItem(ListInfoMation);
                        // props.handleGetDataClick(ListInfoMation);
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
                //   if (!isLoadedAllVectorSource) {
                //     let _isHaveHighlightVectorlayer = false;
                //     listLayer.forEach((_layer) => {
                //       if (
                //         _layer instanceof VectorLayer &&
                //         _layer.getClassName() === "highlight-vectorlayer"
                //       ) {
                //         _isHaveHighlightVectorlayer = true;
                //         const _newVectorSource = new VectorSource({
                //           features: new GeoJSON().readFeatures(_geojsonObject),
                //         });
                //         _layer.setSource(_newVectorSource);
                //       }
                //     });
                //     console.log(
                //       "_isHaveHighlightVectorlayer",
                //       _isHaveHighlightVectorlayer
                //     );
                //     if (!_isHaveHighlightVectorlayer) {
                //       console.log("_geojsonObject", _geojsonObject);
                //       listLayer.push(
                //         new VectorLayer({
                //           className: "highlight-vectorlayer",
                //           source: new VectorSource({
                //             features: new GeoJSON().readFeatures(_geojsonObject),
                //           }),
                //           zIndex: 999,
                //           style: new Style({
                //             stroke: new Stroke({
                //               color: "rgba(0,230,241,1)",
                //               width: 1,
                //             }),
                //             fill: new Fill({
                //               color: "rgba(223,16, 188,1)",
                //             }),
                //           }),
                //         })
                //       );
                //     }
                //   }
                } else {
                  //removeHiglightVectorLayer();
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
      
    }
  };
