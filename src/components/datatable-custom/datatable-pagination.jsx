import React from 'react';
import "./datatable.scss"

export default function DataTablePagination(props) {
    const {
        totalItemCount,
        rowsPerPage,
        pageIndex,
        handleChangePage
    } = props;

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItemCount / rowsPerPage);


    // Generate page numbers for pagination
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3; // Change this value to control the maximum visible page numbers
        let startPage = Math.max(1, pageIndex - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            pageNumbers.push(
                <li key="start" className="page-item">
                    <a className="page-link" href="#" onClick={() => handleChangePage(1)}>1</a>
                </li>
            );
            if (startPage > 2) {
                pageNumbers.push(
                    <li key="startEllipsis" className="page-item disabled">
                        <span className="page-link">...</span>
                    </li>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <li key={i} className={`page-item ${pageIndex === i ? 'active' : ''}`}>
                    <a className="page-link" href="#" onClick={() => {
                        if( pageIndex != i) handleChangePage(i);
                    }}>
                        {i}
                    </a>
                </li>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(
                    <li key="endEllipsis" className="page-item disabled">
                        <span className="page-link">...</span>
                    </li>
                );
            }
            pageNumbers.push(
                <li key="end" className="page-item">
                    <a className="page-link" href="#" onClick={() => handleChangePage(totalPages)}>
                        {totalPages}
                    </a>
                </li>
            );
        }

        return pageNumbers;
    };

    return (
        <div className="row">
            <div className="col-sm-12 col-md-5">
                {
                    pageIndex && rowsPerPage && totalItemCount &&
                        <div className="dataTables_info">
                            Đang xem {(pageIndex - 1) * rowsPerPage + 1} đến {Math.min(pageIndex * rowsPerPage, totalItemCount)} trong tổng số {totalItemCount} mục
                        </div>
                }
            </div>
            <div className="col-sm-12 col-md-7">
                <div className="dataTables_paginate">
                    <ul className="pagination">
                        <li className={`page-item ${(!pageIndex || pageIndex === 1) ? 'disabled' : ''}`}>
                            <a className="page-link" href="#" aria-label="Previous" onClick={() => handleChangePage(pageIndex - 1)}>
                                <span aria-hidden="true">&laquo;</span>
                                <span className="sr-only">Previous</span>
                            </a>
                        </li>
                        {renderPageNumbers()}
                        <li className={`page-item ${(!pageIndex || !totalPages || pageIndex === totalPages) ? 'disabled' : ''}`}>
                            <a className="page-link" href="#" aria-label="Next" onClick={() => handleChangePage(pageIndex + 1)}>
                                <span aria-hidden="true">&raquo;</span>
                                <span className="sr-only">Next</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
