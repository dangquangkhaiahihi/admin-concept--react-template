import React from 'react';

import DataTableButtonsFunction from "./datatable-buttons-function";
import DataTableHeader from "./datatable-content";
import DataTablePagination from "./datatable-pagination";

export default function DataTableCustom(props) {
    const {
        listData,
        // button functions
        rowsPerPage,
        handleChangeRowsPerPage,
        // head cells
        headCells,
        handleRequestSort,
        // footer pagination
        totalItemCount,
        pageIndex,
        handleChangePage,
        order,
        orderBy,
        // children
        children,
        sumary
    } = props;
    
    return (
        <div className="card">
            <div className="card-body">
                <DataTableButtonsFunction
                    rowsPerPage={rowsPerPage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    sumary={sumary }
                />
                <DataTableHeader
                    headCells={headCells}
                    handleRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    listData={listData}
                    totalItemCount={totalItemCount}
                >
                    {children}
                </DataTableHeader>
                {
                    totalItemCount > 0 ?
                    <DataTablePagination
                        totalItemCount={totalItemCount}
                        rowsPerPage={rowsPerPage}
                        pageIndex={pageIndex + 1}
                        handleChangePage={handleChangePage}
                    /> :
                    <></>
                }
            </div>
        </div>
    )
}