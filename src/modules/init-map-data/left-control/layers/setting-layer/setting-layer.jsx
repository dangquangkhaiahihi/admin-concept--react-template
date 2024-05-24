import { Paper, TextField } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import * as InitmapConfig from '../../../config/config';

export default function SettingLayerTypeView(props) {
    const {
        isImportShapeFile,
        isImportTifFile,
        setValueShapeFileStep_2,
        valueShapeFileStep_2,
        isLayerRela,
        layerId,
    } = props;

    const [layerName, setLayerName] = useState(props.layerSetting.layerName);
    const [layerZIndex, setLayerZIndex] = useState(props.layerSetting.zIndex)
    const [layerMinzoom, setLayerMinzoom] = useState(props.layerSetting.minZoom);
    const [layerMaxzoom, setLayerMaxzoom] = useState(props.layerSetting.maxZoom);
    const [viewDefault, setViewDefault] = useState(props.layerSetting.defaultTurnOn);
    const [year, setYear] = useState();
    const [contentChange, setContentChange] = useState();
    const handleUpdateData = () => {
        if(isLayerRela) {
            props.setLayerSetting(
                new InitmapConfig.CreateLayerSettingObject(
                    layerName, 
                    layerMinzoom, 
                    layerMaxzoom, 
                    layerZIndex, 
                    viewDefault,
                    year,
                    contentChange,
                    layerId,
                )
            );
        } else {
            props.setLayerSetting(
                new InitmapConfig.CreateLayerSettingObject(
                    layerName, 
                    layerMinzoom, 
                    layerMaxzoom, 
                    layerZIndex, 
                    viewDefault,
                )
            );
        }
    }

    useEffect(() => {
        handleUpdateData()
    }, [layerName, layerZIndex, layerMinzoom, layerMaxzoom, viewDefault, contentChange, year])
    useEffect(() => {
        if (isLayerRela) {
            console.log('okokokokok')
        }
    }, [isLayerRela])
    return (
        <div className="container-fluid">
            {
                isImportShapeFile
                    ? (
                        <div className="row mt-3">
                            <div className="col-6 mx-auto">
                                <Paper className="p-3" elevation={3}>
                                    <div className="form-group">
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            label="Tên thư mục cha"
                                            defaultValue={valueShapeFileStep_2.RootFolderName}
                                            disabled={true}
                                            onChange={(event) => setValueShapeFileStep_2({ ...valueShapeFileStep_2, RootFolderName: event.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            label="Tên Shape file"
                                            disabled={true}
                                            defaultValue={valueShapeFileStep_2.ShpFileName}
                                            onChange={(event) => setValueShapeFileStep_2({ ...valueShapeFileStep_2, ShpFileName: event.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            label="Tên bảng"
                                            disabled={true}
                                            defaultValue={valueShapeFileStep_2.TableName}
                                            onChange={(event) => setValueShapeFileStep_2({ ...valueShapeFileStep_2, TableName: event.target.value })}
                                        />
                                    </div>
                                </Paper>
                            </div>
                        </div>
                    ) : (
                        <div className="row mt-3">
                            <div className="col-12">
                                <Paper className="p-3" elevation={3}>
                                    <div className="row">
                                        <div className="col-6 mx-auto">
                                            <div className="form-group">
                                                <label htmlFor="inputLayerName">Tên layer <span style={{ color: 'red' }}>*</span></label>
                                                <input type="text" className="form-control" value={layerName} onChange={(event) => setLayerName(event.target.value)} id="inputLayerName" placeholder="Nhập tên layer" />
                                            </div>
                                            {isLayerRela && (
                                                <div>
                                                    <div className="form-group mt-3">
                                                        <label htmlFor="inputLayerName">Năm điều chỉnh <span style={{ color: 'red' }}>*</span></label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={year}
                                                            onChange={(event) => setYear(event.target.value)}
                                                            id="inputLayerName"
                                                            placeholder="Nhập năm điều chỉnh"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="inputPlanningName">Nội dung điều chỉnh <span style={{ color: 'red' }}>*</span></label>
                                                        <textarea
                                                            rows="4" 
                                                            cols="50"
                                                            type="text"
                                                            className="form-control"
                                                            value={contentChange}
                                                            onChange={(event) => setContentChange(event.target.value)}
                                                            id="inputPlanningName"
                                                            placeholder="Nhập nội dung"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div class="form-check">
                                                <input type="checkbox" checked={viewDefault} onClick={() => setViewDefault(!viewDefault)} class="form-check-input" id="checkboxDefaultView" />
                                                <label class="form-check-label" htmlFor="checkboxDefaultView">Hiển thị mặc định</label>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="form-group">
                                                <label htmlFor="inputLayerName">Z-index:</label>
                                                <input type="number" className="form-control" min={1} value={layerZIndex} onChange={(event) => setLayerZIndex(event.target.value)} id="inputLayerName" placeholder="Mức độ ưu tiên hiển thị của layer" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputLayerName">Min Zoom:</label>
                                                <input type="number" className="form-control" value={layerMinzoom} min={0} onChange={(event) => setLayerMinzoom(event.target.value)} id="inputLayerName" placeholder="Mức độ thu nhỏ nhất" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputLayerName">Max Zoom:</label>
                                                <input type="number" className="form-control" value={layerMaxzoom} max={20} onChange={(event) => setLayerMaxzoom(event.target.value)} id="inputLayerName" placeholder="Nhập tên layer" />
                                            </div>
                                        </div>
                                    </div>
                                </Paper>
                            </div>
                        </div>
                    )
            }
        </div>
    )
}