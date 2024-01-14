import React from "react";
import "./open-layer.scss";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { Image as ImageLayer, Layer } from "ol/layer";
import OSM from "ol/source/OSM";
import ImageWMS from "ol/source/ImageWMS";
import XYZ from "ol/source/XYZ";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as OpenlayerStore from "../../redux/store/openlayer/openlayer.store";
import OpenlayerModelCollect from "../../models/open-layer/props-state";
import BaseMapModels from "../../models/init-map-state/base-map";
import LayerModels from "../../models/init-map-state/layers";
import ControlFunctionType from "./control-function-type/control-function-type";
import TileWMS from "ol/source/TileWMS";
import { TileLayerClassName } from "../../modules/init-map-data/config/config";
class OpenlayerMapView extends React.Component<
  OpenlayerModelCollect.OpenlayerMapViewPropsModel,
  OpenlayerModelCollect.OpenlayerMapViewStateModel
> {
  constructor(props: any) {
    super(props);
    this.state = {
      map: null,
      mapContainerStyle: null,
    };
  }

  outSideHandleFunction = (type: string, option: any) => {

    switch (type) {
      case ControlFunctionType.ToggleDisplayLayer:
        {
          let indexRemove = -1;
          const LayerChange: LayerModels.layer_settingsModel = option.layer;

          const listLayerCollection = this.state.map.getLayers();
          listLayerCollection.forEach((event: any, index: number) => {
            if (
              event.values_.source.params_ &&
              event.values_.source.params_.LAYERS === `${LayerChange.table}`
            ) {
              indexRemove = index;
              return;
            }
          });

          if (indexRemove !== -1) {
            listLayerCollection.removeAt(indexRemove);
          } else
            listLayerCollection.push(
              new ImageLayer({
                extent: this.props.mapSetting.extent,
                source: new ImageWMS({
                  url: LayerChange.wms,
                  params: {
                    FORMAT: "image/png",
                    VERSION: "1.1.0",
                    STYLES: "",
                    LAYERS: `${LayerChange.table}`,
                  },
                  ratio: 1,
                  crossOrigin: "anonymous",
                }),
              })
            );
        }
        break;

      case ControlFunctionType.SelectDisplayBasemap:
        {
          
          const BaseMapChange: BaseMapModels.base_mapsModel = option.basemap;
          const listLayerCollection = this.state.map.getLayers();

          if (BaseMapChange.baseMapSettingModel.layer_type !== "NONE") {
            listLayerCollection.insertAt(
              0,
              new TileLayer({
                source: new XYZ({
                  url: BaseMapChange.url,
                }),
              })
            );
            listLayerCollection.removeAt(1);
          } else {
            listLayerCollection.item(0).setVisible(false);
          }
        }
        break;
      default: {
        // console.log('have un set type:' + type)
        // console.log(option)
      }
    }
  };

  componentDidMount() {
    const DefaultGroupLayer: any[] = [];
    let listBaseMap = this.props.baseMaps;
    let listLayerGroup = this.props.layers.layer_categories;

    // get
    let defaultListLayer: any = [];
    if (this.props.layers.haveData) {
      this.props.layers.layer_categories.map((item) => {
        item.layer_settings.map((i) => {
          defaultListLayer.push(i);
        });
      });
    }

    defaultListLayer.map((layerData: any, index: any) => {
      const layerImage: any = new TileLayer({
        visible: layerData.is_check,
        zIndex: layerData.z_index,
        minZoom: layerData.min_zoom,
        maxZoom: layerData.max_zoom,
        source: new TileWMS({
          url: layerData.wms,
          params: {
            LAYERS: `'sonla':${layerData.table}`,
            LayerId: layerData.id,
            FORMAT: "image/png",
            VERSION: "1.1.0",
          },
          crossOrigin: "anonymous",
        }),
        className: TileLayerClassName(layerData.id),
      });
      DefaultGroupLayer.push(layerImage);
    });

    listBaseMap.base_maps.map((baseMap: any) => {
      if (baseMap.view_default) {
        DefaultGroupLayer.push(
          new TileLayer({
            source: new XYZ({
              url: baseMap.url,
              crossOrigin: "anonymous",
            }),
          })
        );
      }
    });

    listLayerGroup.map((layerGroup: any) => {
      layerGroup.layer_settings.map((layer: any) => {
        if (layer.is_check)
          DefaultGroupLayer.push(
            new ImageLayer({
              extent: this.props.mapSetting.extent,
              source: new ImageWMS({
                url: layer.wms,
                params: {
                  FORMAT: "image/png",
                  VERSION: "1.1.0",
                  STYLES: "",
                  LAYERS: `${layer.table}`,
                },
                ratio: 1,
                crossOrigin: "anonymous",
              }),
            })
          );
      });
    });

    if (DefaultGroupLayer.length === 0) {
      DefaultGroupLayer.push(
        new TileLayer({
          source: new OSM(),
          visible: false,
        })
      );
    }


    
    this.props.SetOutSideHandleFunction(this.outSideHandleFunction);
    let mapOpenLayer = new Map({
      target: "map-container-id",
      layers: DefaultGroupLayer,
      view: new View({
        projection: this.props.mapSetting.projection,
        center: this.props.mapSetting.center,
        zoom: this.props.mapSetting.zoom,
      }),
    });
    this.setState({
      map: mapOpenLayer,
    });

    this.props.setMapLayer(mapOpenLayer);

    mapOpenLayer.on("moveend", this.onMoveEnd);
  }

  componentDidUpdate(
    prevProps: Readonly<OpenlayerModelCollect.OpenlayerMapViewPropsModel>,
    prevState: Readonly<OpenlayerModelCollect.OpenlayerMapViewStateModel>,
    snapshot?: any
  ): void {
    console.log("sss", this.props.layers.layer_categories);
    let defaultListLayer: any = [];
    if (this.props.layers.haveData) {
      this.props.layers.layer_categories.map((item) => {
        item.layer_settings.map((i) => {
          defaultListLayer.push(i);
        });
      });
    }

    defaultListLayer.map((layer: any) => {
      this.toggleDisplayVectorLayer(layer);
    });
  }

  toggleDisplayVectorLayer = (layer: any) => {
    const LayersCurrents = this.state.map?.getLayers();
    let hasLayer = LayersCurrents.array_.find((x: any) => x.className_ === `title-layer-${layer.id}`);
    LayersCurrents?.forEach((layerModel: Layer) => {
      if (layerModel.getClassName() === `title-layer-${layer.id}`) {
        layerModel.setVisible(layer.is_check);
        return;
      }
    });

    if (!hasLayer) {
      // add new layer
      const layerImage: any = new TileLayer({
        visible: false,
        zIndex: layer.z_index,
        minZoom: layer.min_zoom,
        maxZoom: layer.max_zoom,
        source: new TileWMS({
          url: layer.wms,
          params: {
            LAYERS: `'sonla':${layer.table}`,
            LayerId: layer.id,
            FORMAT: "image/png",
            VERSION: "1.1.0",
          },
          crossOrigin: "anonymous",
        }),
        className: TileLayerClassName(layer.id),
      });

      this.state.map.addLayer(layerImage);
    }
  };

  onMoveEnd = (event: any) => {
    let map = event.map;
    let extend = map?.getView().calculateExtent(map.getSize());
    let zoom = map?.getView().getZoom();
    this.props.setExtend(extend);
    this.props.setZoom(Math.round(zoom));
  };

  render() {
    return (
      <div className="h-100" id="map-container-id">
        {/* <MapToolPanel map={this.state.map} /> */}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  mapSetting: state.initMap.mapSetting,
  baseMaps: state.initMap.baseMaps,
  layers: state.initMap.layers,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      SetOutSideHandleFunction: OpenlayerStore.SetHandleOutsideFunction,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OpenlayerMapView);
