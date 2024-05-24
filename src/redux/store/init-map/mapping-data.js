import { ConvertStringToNumberArray } from '../../../common/tools';
import { ApiUrl } from "../../../api/api-url";
import Service from "../../../api/api-service";
const service = new Service()

export function MappingSettingMapData(data) {
    if (data) return {
        haveData: true,
        center: ConvertStringToNumberArray(data.center),
        extent: ConvertStringToNumberArray(data.extent),
        id: data.id,
        max_zoom: data.max_zoom,
        min_zoom: data.min_zoom,
        name: data.name,
        planing_id: data.planing_id,
        projection: data.projection,
        zoom: data.zoom,
        z_index: data.z_index,
        is_active: data.is_active
    }; else return {
        haveData: false,
    }
}


export function MappingBaseMapData(data) {
    if (data) return {
        haveData: true,
        id: data.id,
        name: data.name,
        type_map: data.type_map,
        map_id: data.map_id,
        base_maps: MappingDataBaseMapArray(data.base_maps)
    }; else return {
        haveData: false,
    }
}

export function MappingLayersData(data) {
    if (data) return {
        haveData: true,
        id: data.id,
        map_id: data.map_id,
        name: data.name,
        type_map: data.type_map,
        layer_categories: MappingListLayerCategori(data.layer_categories)
    }; else return {
        haveData: false,
    }
}

export function MappingBaseMapArrayDefault(arrayData) {
    const result = [];
    arrayData.map(baseMap => result.push({
        id: baseMap.id,
        layer_type: baseMap.layer_type,
        name: baseMap.name,
        status: baseMap.status,
        url: baseMap.url
    }))
    return result;
}

export function MappingListDataSource(arrayData) {
    const result = [];
    arrayData.map(rawData => result.push({
        tableName: rawData.tableName,
        cols: MappingListDataSourceCol(rawData.cols)
    }))
    return result;
}

function MappingListDataSourceCol(colArray) {
    const result = [];
    colArray.map(col => result.push({
        column_name: col.column_name,
        data_type: col.data_type
    }))
    return result;
}

function MappingListLayerCategori(ArrayLayerCategory) {
    const result = [];
    ArrayLayerCategory.map(layerCategory => result.push({
        id: layerCategory.id,
        level: layerCategory.level,
        map_setting_id: layerCategory.map_setting_id,
        folder_label: layerCategory.folder_label,
        folder_name: layerCategory.folder_name,
        layer_settings: MappingLayerSettingArray(layerCategory.layer_settings),
    }))
    return result
}

function MappingLayerSettingArray(layer_settings) {
    const result = [];
    layer_settings.map((layer) => result.push({
        displayName: layer.display_name,
        filterName: layer.filter_name,
        geoLayerName: layer.geo_layer_name,
        id: layer.id,
        is_check: layer.is_check,
        layerCategoryId: layer.layer_category_id,
        layerType: layer.layer_type,
        level: layer.level,
        maxZoom: layer.max_zoom,
        minZoom: layer.min_zoom,
        name: layer.name,
        table: layer.table,
        wms: layer.wms,
        wmsExternal: layer.wms_external,
        zindex: layer.z_index,
        documentUploadId: layer.document_upload_id,
        files: layer.files,
        layerRealationships:layer?.layerRealationships? MappingLayerRelaSettingArray(layer?.layerRealationships): null,
    }))
    return result;
}

function MappingLayerRelaSettingArray(layer_settings) {
    const result = [];
    layer_settings.map((layer) => result.push({
        displayName: layer.display_name,
        filterName: layer.filter_name,
        geoLayerName: layer.geo_layer_name,
        id: layer.id,
        is_check: layer.is_check,
        layerCategoryId: layer.layer_category_id,
        layerType: layer.layer_type,
        level: layer.level,
        maxZoom: layer.max_zoom,
        minZoom: layer.min_zoom,
        name: layer.name,
        table: layer.table,
        wms: layer.wms,
        wmsExternal: layer.wms_external,
        zindex: layer.z_index,
        documentUploadId: layer.document_upload_id,
        files: layer.files,
        contentChange: layer.contentChange,
        layerRealationshipId: layer.layerRealationshipId,
        year: layer.year,
    }))
    return result;
}

function MappingDataBaseMapArray(BaseMapArray) {
    let result = [];
    BaseMapArray.map(baseMap => result.push({
        baseMapSettingModel: MappingBaseMapSettingModel(baseMap.baseMapSettingModel),
        base_map_setting_id: baseMap.base_map_setting_id,
        id: baseMap.id,
        map_setting_id: baseMap.map_setting_id,
        url: baseMap.url,
        view_default: baseMap.view_default,
        z_index: baseMap.z_index,
        name: baseMap.name
    }))
    return result
}

function MappingBaseMapSettingModel(data) {
    return {
        id: data.id,
        layer_type: data.layer_type,
        name: data.name,
        status: data.status,
        url: data.url
    }
}
export const GetListPgTable = (table) => {
    let param = new URLSearchParams();
    table && param.append("tableName", table);
    return service.get(ApiUrl.GetPgTable, param).then((res) => { return res }).catch(err => { throw err })
}

export const DeleteMapById = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.delete(ApiUrl.DeleteMap, params).then(res => { return res }).catch(err => { throw err })
}