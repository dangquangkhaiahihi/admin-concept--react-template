export default function CreateDefaultMapData(planningId, mapId = null, defaultCordinate = null) {
    return ({
        "id": mapId || 0,
        "planing_id": planningId,
        "name": "",
        "z_index": 0,
        "zoom": defaultCordinate ? defaultCordinate.zoom : 9,
        "min_zoom": defaultCordinate ? defaultCordinate.min_zoom : 8,
        "max_zoom": defaultCordinate ? defaultCordinate.max_zoom : 20,
        "projection": "EPSG:4326",
        // "extent": defaultCordinate ? defaultCordinate.extent : "105.7,19.8,105.8,19.9",
        // "center": defaultCordinate ? defaultCordinate.center : "105.75004,19.81655",
        "extent": "103.81957710326117,21.277280284410068,103.9615467691579,21.366504275824347",
        "center": "103.8905619362095,21.321892280117208",
        "map_setting": [
            {
                "id": 0,
                "map_id": mapId || 0,
                "name": "MAP",
                "type_map": "MAP",
                "layer_categories": [],
                "base_maps": [
                    {
                        "baseMapSettingModel": {
                            "id": 2,
                            "layer_type": "GOOGLE",
                            "name": "Bản đồ nền giao thông",
                            "status": false,
                            "url": "https://mt0.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}"
                        },
                        "base_map_setting_id": 2,
                        "id": 0,
                        "map_setting_id": 0,
                        "url": "https://mt0.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}",
                        "view_default": true,
                        "z_index": 0,
                        "name": "Bản đồ google"
                    }
                ]
            },
            {
                "id": 0,
                "map_id": mapId || 0,
                "name": "Layer",
                "type_map": "LAYER",
                "layer_categories": [],
                "base_maps": []
            }
        ]
    })
}