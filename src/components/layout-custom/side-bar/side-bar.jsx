// active
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as accountManagementAction from "../../../redux/store/account/account.store";
import {
    getCookies, setCookies, getUserInfo
} from "../../../utils/configuration";
import { UrlCollectionCustom } from '../../../common/url-collection-custom';

export default function SideBarCustom() {
    const currentLocation = useLocation();

    const isDashboardHome = currentLocation.pathname === UrlCollectionCustom.Home;

    // Plan: 'goi-dang-ky',
    // Client: 'khach-hang',
    // ClientNote: 'lich-su-ghi-chu',
    // Order: 'don-hang',
    // DepositHistory: 'lich-su-nap-tien',
    const isPlan = currentLocation.pathname === UrlCollectionCustom.Plan;
    const isClient = currentLocation.pathname === UrlCollectionCustom.Client;
    const isClientNote = currentLocation.pathname === UrlCollectionCustom.ClientNote;
    const isOrder = currentLocation.pathname === UrlCollectionCustom.Order;
    const isDepositHistory = currentLocation.pathname === UrlCollectionCustom.DepositHistory;
    const isClientManagement = isPlan ||
                isClient ||
                isClientNote ||
                isOrder ||
                isDepositHistory;

    // Profile: '/tai-khoan',
    // AccountManagement: 'quan-ly-tai-khoan',
    // RoleManagement: '/quan-ly-chuc-vu'
    const isProfile = currentLocation.pathname === UrlCollectionCustom.Profile;
    const isAccountManagement = currentLocation.pathname === UrlCollectionCustom.AccountManagement;
    const isRoleManagement = currentLocation.pathname === UrlCollectionCustom.RoleManagement;
    const isAdministrative = isProfile ||
                isAccountManagement ||
                isRoleManagement;

    return (
        <div className="nav-left-sidebar sidebar-dark">
            <div className="menu-list">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <a className="d-xl-none d-lg-none" href="#"></a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav flex-column">
                            
                            <li className={`nav-item`}>
                                <Link className={`nav-link ${ isDashboardHome ? 'active' :''}`} to={UrlCollectionCustom.Home}><i className="fas fa-fw fa-home"></i>Trang chủ</Link>
                            </li>
                            <li className={`nav-item`}>
                                <a className={`nav-link ${isClientManagement ? 'active' : ''}`} href="#" data-toggle="collapse" aria-expanded={isClientManagement} data-target="#submenu-1" aria-controls="submenu-1"><i className="fas fa-fw fa-user-secret"></i>Quản lý khách hàng</a>
                                <div id="submenu-1" className={`collapse submenu ${isClientManagement ? 'show' : ''}`}>
                                    <ul className="nav flex-column">
                                        <li className="nav-item">
                                            <Link className={`nav-link ${isPlan ? 'active' : ''}`} to={UrlCollectionCustom.Plan}>Gói đăng ký</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={`nav-link ${isClient ? 'active' : ''}`} to={UrlCollectionCustom.Client}>Khách hàng</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={`nav-link ${isClientNote ? 'active' : ''}`} to={UrlCollectionCustom.ClientNote}>Lịch sử ghi chú</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={`nav-link ${isOrder ? 'active' : ''}`} to={UrlCollectionCustom.Order}>Đơn hàng</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={`nav-link ${isDepositHistory ? 'active' : ''}`} to={UrlCollectionCustom.DepositHistory}>Lịch sử nạp tiền</Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className={`nav-item`}>
                                <a className={`nav-link ${isAdministrative ? 'active' : ''}`} href="#" data-toggle="collapse" aria-expanded={isAdministrative} data-target="#submenu-2" aria-controls="submenu-2"><i className="fas fa-fw fa-user-secret"></i>Quản trị viên</a>
                                <div id="submenu-2" className={`collapse submenu ${isAdministrative ? 'show' : ''}`}>
                                    <ul className="nav flex-column">
                                        <li className="nav-item">
                                            <Link className={`nav-link ${isProfile ? 'active' : ''}`} to={UrlCollectionCustom.Profile}>Thông tin tài khoản</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={`nav-link ${isRoleManagement ? 'active' : ''}`} to={UrlCollectionCustom.RoleManagement}>Chức vụ</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={`nav-link ${isAccountManagement ? 'active' : ''}`} to={UrlCollectionCustom.AccountManagement}>Tài khoản</Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className={`nav-item`}>
                                <Link className={`nav-link`} to={'#'}><i className="fas fa-fw fa-home"></i>Đăng xuất</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    )
}