import React, { useEffect, useState } from 'react';
import "./datatable.scss";
import * as config from '../../common/config'


export default function DataTableButtonsFunction(props) {
    const {
        rowsPerPage,
        handleChangeRowsPerPage,
        sumary
    } = props;
    return (
        <div className="row">
            <div className="col-12 col-md-9 mb-2">
                
            </div>
            <div className="col-12 col-md-3 mb-2 ">
                <label className='d-flex align-items-end justify-content-end' style={{ gap: "10px" }}>
                    Xem 
                    <select
                        className="custom-select custom-select-sm form-control form-control-sm"
                        style={{width: "50px"}}
                        value={rowsPerPage}
                        onChange={handleChangeRowsPerPage}
                    >
                        {config.Configs.DefaultPageSizeOption.map((pageSize, index) => (
                            <option key={index} value={pageSize}>{pageSize}</option>
                        ))}
                    </select> 
                    mục
                </label>
            </div>
        </div>
    )
}