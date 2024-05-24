import React, { useEffect, useRef, useState } from 'react';
import "./datatable.scss"

export default function DataTableHeader(props) {
    const { headCells, children, handleRequestSort, order, orderBy, listData, totalItemCount } = props;
    
    const [scrollTableWidth, setScrollTableWidth] = useState(0);

    const scrollRoot = useRef(null);
    const scrollTable = useRef(null);

    useEffect(() => {
        if (totalItemCount > 0 && scrollTable.current) {
            setScrollTableWidth(scrollTable.current.clientWidth)
        }
    }, [totalItemCount]);

    return (
        <>
            <div className="row">
                <div className="col-sm-12 mb-2 dataTables" ref={scrollRoot}>
                    <table className="table table-bordered table-hover dataTable" ref={scrollTable} id="datatable">
                        <EnhancedTableHead
                            headCells={headCells}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        {children}
                    </table>
                </div>
            </div>
            {
                scrollTableWidth ? 
                    <div className='scrollRoot'
                        onScroll={(e) => {scrollRoot.current.scrollLeft = e.target.scrollLeft}}
                    >
                        <div style={{width: `${scrollTableWidth}px`}}>
                            &nbsp;
                        </div>
                    </div> : <></>
            }
        </>
    )
}

function EnhancedTableHead(props) {
    const { headCells, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property, isSort=true) => (event) => {
        if (isSort)
      onRequestSort(event, property);
    };

    return (
        <thead>
            <tr>
                {headCells.map((headCell) => (
                    <th
                        scope="col"
                        className={`${headCell.className} ${headCell.disablePadding ? "" : (orderBy !== headCell.id ? "sorting" : (order !== "desc" ? "sorting_asc" : "sorting_desc"))}`}
                        key={headCell.id}
                        aria-sort={`${orderBy !== headCell.id ? null : order !== "desc" ? "ascending" : "descending"}`}
                        onClick={createSortHandler(headCell.id, !headCell.disablePadding)}
                        style={headCell.style ? { ...headCell.style, fontWeight: 'bold', textAlign: 'center' } : { fontWeight: 'bold', textAlign: 'center'}}
                    >
                        {/* style={headCell.style ? {...headCell.style, textAlign: headCell.numeric ? 'left' : 'right'} : {textAlign: headCell.numeric ? 'left' : 'right'}}
                                <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                                hideSortIcon={headCell.disablePadding ? true : false}> */}
                            {headCell.label}
                    </th>
                ))}
            </tr>
        </thead>
    );
  }