import React, { useEffect, useState } from "react";
import Select from "react-select";

const MobileHeaderCustom = (props) => {
    const { handleSortChange, headCell, setOrder, setOrderBy } = props;
    const [headCellSort, setHeadCellSort] = useState([]);

    useEffect(() => {
        var sortColumn = [];
        headCell && headCell.map((row) => {
            if (!row.disablePadding) {
                sortColumn.push({ value: row.id + " asc", label: row.label + " (tăng dần)" });
                sortColumn.push({ value: row.id + " desc", label: row.label + " (giảm dần)" })
            }
        });
        setHeadCellSort(sortColumn);
    }, []);

    const handleDataSortChange = (sortData) => {
        if (!sortData) return;
        setOrder(sortData.value.includes("desc") ? "desc" : "asc");
        setOrderBy(sortData.value.replace("desc", "").replace("asc", ""));
        handleSortChange(sortData.value);
    };

    return <div className="card">
        <div className="d-flex align-items-center">
            <div className="list-group-item list-group-item-action flex-column align-items-start collapsed" style={{ border: "none" }}
                data-toggle="collapse" aria-expanded="false" >
                <div className="row">
                    <div className="col-3">
                        {/*
                            <div className="col-4">
                                    <label className='d-flex align-items-end justify-content-end' style={{ gap: "10px" }}>
                                        
                                        <select
                                            className="custom-select custom-select-sm form-control form-control-sm"
                                            style={{ width: "50px" }}
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
                        */}
                        Sắp xếp
                    </div>
                    <div className="col-9">
                        <Select
                            onChange={(data) => {
                                handleDataSortChange(data);
                            }}
                            isClearable
                            isSearchable={false}
                            options={headCellSort}
                            noOptionsMessage={() => "Không tồn tại"}
                            // style để dropdown đè absolute lên cả body thay vì bị giới hạn chỉ trong table
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default MobileHeaderCustom;