import React, { useState } from "react";
import * as styles from "./form-search-wrapper-toggleable.module.scss";

const FormSearchWrapperToggleable = (props) => {
    const { children, isTabletOrMobile, openSearch, setOpenSearch, openAddDialog, hideNewButton } = props;
    return <div className={`card ${isTabletOrMobile ? `position-sticky` : ''} ${styles.search_section} ${(openSearch) ? styles._open : ''}`}>
        <div className="card-body p-2 p-md-4">
            <div className={`${styles.form_search_wrapper} ${(openSearch) ? styles._open : ''}`}>
                {children}
            </div>
            <div className="row">
                <div className="col-sm-12 pl-0">
                    <p className="text-center">
                        <button type="button" className={`btn btn-space ${!openSearch ? 'btn-primary' : 'btn-danger'}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setOpenSearch(openSearch => !openSearch);
                            }}
                        >
                            {
                                !openSearch ? 'Mở tìm kiếm' : 'Đóng tìm kiếm'
                            }
                        </button>
                        {!openSearch && (hideNewButton === undefined || !hideNewButton) ?
                        <button
                            className="btn btn-space btn-warning"
                            onClick={(e) => {
                                e.preventDefault();
                                openAddDialog();
                            }}
                            >Thêm mới</button> : <></>
                        }
                    </p>
                </div>
            </div>
        </div>
    </div>
}

export const FormSearchFunctionButtons = ({children}) => {

    return (
        <div className={styles.function_buttons_wrapper}>
            {children}
        </div>
    )
}

export default FormSearchWrapperToggleable;