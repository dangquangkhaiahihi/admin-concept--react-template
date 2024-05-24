import React from 'react';
import * as MaterialUi from '@material-ui/core';
import RenderFieldInfomation from '../child/field-infomation';

export default function GeneralInfomationView(props) {
    const data = props.data;
    return (
        <ul className="list-group">
            <RenderFieldInfomation title="Tên layer" content={data.name} />
            <RenderFieldInfomation title="Z-index" content={data.z_index} />
            <RenderFieldInfomation title="Min zoom" content={data.min_zoom} />
            <RenderFieldInfomation title="Max zoom" content={data.max_zoom} />
            <RenderFieldInfomation title="Hiển thị mặc định" content={data.is_check ? 'Bật' : "Tắt"} />
            <RenderFieldInfomation title="Bảng dữ liệu" content={data.table} />
            <RenderFieldInfomation title="Style" content={data.style} />
            <RenderFieldInfomation title="Loại wms" content={data.wms_external ? "Bên ngoài" : "Trong hệ thống"} />
        </ul>
    )
}