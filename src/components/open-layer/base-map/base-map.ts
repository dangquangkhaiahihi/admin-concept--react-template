import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import OSM from "ol/source/OSM";

export default class BaseMapCreate {
  constructor() {}

  BaseMapGoogleAlteredRoadmap = new TileLayer({
    source: new XYZ({
      url: "https://mt0.google.com/vt/lyrs=r&hl=vi&x={x}&y={y}&z={z}",
    }),
  });

  BaseMapGoogleTerrainOnly = new TileLayer({
    source: new XYZ({
      url: "https://mt0.google.com/vt/lyrs=t&hl=vi&x={x}&y={y}&z={z}",
    }),
  });

  BaseMapGoogleHybird = new TileLayer({
    source: new XYZ({
      url: "https://mt0.google.com/vt/lyrs=y&hl=vi&x={x}&y={y}&z={z}",
    }),
  });

  BaseMapGoogleSatelliteOnly = new TileLayer({
    source: new XYZ({
      url: "https://mt0.google.com/vt/lyrs=s&hl=vi&x={x}&y={y}&z={z}",
    }),
  });

  BaseMapGoogleTerrain = new TileLayer({
    source: new XYZ({
      url: "https://mt0.google.com/vt/lyrs=p&hl=vi&x={x}&y={y}&z={z}",
    }),
  });

  BaseMapGoogleRoadmap = new TileLayer({
    source: new XYZ({
      url: "https://mt0.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}",
    }),
  });

  BaseMapOms = new TileLayer({
    source: new OSM(),
  });
}
