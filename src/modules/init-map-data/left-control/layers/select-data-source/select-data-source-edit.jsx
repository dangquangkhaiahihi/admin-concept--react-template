import React, { useState, useEffect } from 'react';
import * as MaterialUi from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as InitMapStore from '../../../../../redux/store/init-map/init-map.store';
import * as InitmapConfig from '../../../config/config';
import { WmsBaseLink } from '../../../../../utils/configuration';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useMediaQuery } from 'react-responsive';

let GlobalIdSetTimeOut = null

function ChangeLayerDataSource(props) {
    const [wms_external, setWms_external] = useState(props.data.wms_external || false)
    const [wms, setWms] = useState(props.data.wms)
    const [table, setTable] = useState('')
    const [style, setStyle] = useState('');
    const [wmsParameters, setWmsParameters] = useState('');

    console.log("props ChangeLayerDataSource",props);
    console.log('current wms_external',wms_external);

    useEffect(() => {
        setTable(props.data.table)
        props.GetListDataSource()
        if (props.dataSource.wms_external) setWms_external(true);
    }, [])

    useEffect(() => {
        if (table || wms) {
            if (GlobalIdSetTimeOut) {
                clearTimeout(GlobalIdSetTimeOut)
            }
            createTaskCreateWmsLink()
        }
    }, [table, wms])

    const createTaskCreateWmsLink = () => {
        GlobalIdSetTimeOut = setTimeout(() => {
            handleCreateWms()
            GlobalIdSetTimeOut = null
        }, 750)
    }

    const handleCreateWms = () => {
        let tableSelected = null;
        let wmsSelected = null;
        let colsSelected = null;
        if (wms_external) {
            tableSelected = InitmapConfig.getTableNameFormUrl(wms);
            wmsSelected = wms;
        } else {
            tableSelected = table;
            wmsSelected = WmsBaseLink + table;
        }
        props.listDataSource.map(dataSource => {
            if (dataSource.tableName === tableSelected) {
                colsSelected = dataSource.cols;
                return;
            }
        })
        if (colsSelected) {
            props.setData({ ...props.data, wms_external: wms_external, wms: wmsSelected, table: tableSelected, display: InitmapConfig.CreateDefaultDisplayStandardObjec(colsSelected), filter: { in: [], out: [], order: '' } })
        }
    }

     //media query
    const isDesktopOrLaptop = useMediaQuery({
        query: "(min-width: 1224px)",
    });
    const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
    const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
    const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

    return (
        <div className={`change-layer-data-source ${isDesktopOrLaptop ? 'container-fluid' : ''}`}>
            <div className="row p-0 m-0">
                <div className="col-lg-6 p-0 m-0">
                    <label>
                        <MaterialUi.Radio
                            color="primary"
                            checked={!wms_external}
                            onChange={() => setWms_external(false)}
                            name="radio-button-demo"
                            id=""
                        /> Wms trong hệ thống
                    </label>
                </div>
                <div className="col-lg-6 p-0 m-0">
                    <label>
                        <MaterialUi.Radio
                            color="primary"
                            checked={wms_external}
                            onChange={() => setWms_external(true)}
                            name="radio-button-demo"
                        />Wms ngoài hệ thống
                    </label>
                </div>
                <div className="col-12" hidden={!wms_external}>
                    <div className="form-group">
                        <label htmlFor="inputOutSystemWms">Link wms (*):</label>
                        <input type="text" className="form-control" id="inputOutSystemWms" value={wms} onChange={(event) => setWms(event.target.value)} placeholder="Nhập địa chỉ wms" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputWmsParameters">Sử dụng tham số:</label>
                        <input type="text" className="form-control" id="inputWmsParameters" value={wmsParameters} onChange={event => setWmsParameters(event.target.value)} placeholder="Nhập tham số wms" />
                    </div>
                </div>
                <div className="col-12" hidden={wms_external}>
                    <Autocomplete
                        id="selectDatasource"
                        blurOnSelect={true}
                        fullWidth={true}
                        disableClearable={true}
                        inputValue={table}
                        onInputChange={(event, newValue) => setTable(newValue)}
                        onChange={(event, newValue) => setTable(newValue.tableName)}
                        options={props.listDataSource}
                        getOptionLabel={(option) => option.tableName}
                        renderInput={(params) => <TextField {...params} label="Nhập bảng wms" variant="outlined" />}
                    />
                    <div className="form-group" hidden>
                        <label htmlFor="selectStyle">Style:</label>
                        <input type="text" className="form-control" id="selectStyle" value={style} onChange={event => setStyle(event.target.value)} placeholder="Nhập style" />
                    </div>
                </div>
                <div className="col-12 mt-3">
                    <br />
                    <p>Chú ý: Thay đổi nguồn dữ liệu sẽ xóa dữ liệu cũ của cài đặt hiển thị và cài đặt lọc</p>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    listDataSource: state.initMap.arrayDataSource
})

const mapDispatchToProps = dispatch => bindActionCreators({
    GetListDataSource: InitMapStore.GetListDataSource
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ChangeLayerDataSource)