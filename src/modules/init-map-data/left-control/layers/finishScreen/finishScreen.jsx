import React from 'react';
import * as MaterialUi from '@material-ui/core';
import RenderFieldInfomation from '../child/field-infomation';

export default function FinishScreen(props) {
    const dataSource = props.dataSource;
    const layerSetting = props.layerSetting;
    return (
        <div>
            <h3 className="text-center">Xác nhận cài đặt</h3>
            <ul className="list-group">
                <RenderFieldInfomation title="Tên layer" content={layerSetting.layerName} />
                <RenderFieldInfomation title="Min zoom" content={layerSetting.minZoom} />
                <RenderFieldInfomation title="Max zoom" content={layerSetting.maxZoom} />
                <RenderFieldInfomation title="Z - Index" content={layerSetting.zIndex} />
                <RenderFieldInfomation title="Mặc định bật" content={(layerSetting.defaultTurnOn) ? 'Bật' : "Tắt"} />
                <RenderFieldInfomation title="Tên bảng dữ liệu" content={dataSource.tableName} />
                <RenderFieldInfomation title="Wms" content={dataSource.wms} />
                <RenderFieldInfomation title="Style" content={dataSource.style} />
                <RenderFieldInfomation title="Tham số Wms" content={dataSource.wmsParameters} />
            </ul>
            <div className="mt-4 mb-3">
                <MaterialUi.Button variant="contained" className="mr-3" onClick={() => props.handleBack()}>Quay lại</MaterialUi.Button>
                <MaterialUi.Button variant="contained" color="primary" onClick={() => props.handleAccept()}>Chấp nhận</MaterialUi.Button>
            </div>
        </div>
    )
}
