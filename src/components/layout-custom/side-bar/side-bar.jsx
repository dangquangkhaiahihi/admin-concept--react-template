// active
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as accountManagementAction from "../../../redux/store/account/account.store";
import {
    getCookies, setCookies, getUserInfo,
    removeCookies,
    TokenKey,
    DomainAdminSide
} from "../../../utils/configuration";
import { UrlCollectionCustom } from '../../../common/url-collection-custom';
import { useDispatch } from 'react-redux';
import { ShowLoading } from '../../../core/app.store';

export default function SideBarCustom() {
    const currentLocation = useLocation();

    const [screens, setScreens] = useState([]);
    const [isShowSystem, setIsShowSystem] = useState(false);
    const [isShowAdmin, setIsShowAdmin] = useState(false);

    const dispatch = useDispatch();
    const showLoading = (data) => dispatch(ShowLoading(data));

    const handleGetMenu = async () => {
        try {
            const res = await accountManagementAction.GetMenu();
            if ( res.content ) {
                setScreens(res.content);
                setIsShowSystem(res.content.some(item => item.code === "PLAN" ||
                    item.code === "CLIENT" ||
                    item.code === "CLIENTNOTE" ||
                    item.code === "ORDER" ||
                    item.code === "DESPOSITEHISTORY" ||
                    item.code === "GROUP"
                ))
                
                setIsShowAdmin(res.content.some(item => item.code === "GROUP" ||
                    item.code === "USER" ||
                    item.code === "ROLE"
                ))
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        handleGetMenu();
    }, [])

    const onLogout = () => {
        removeCookies("isShowDialog");
        removeCookies("isLockScreen");
        removeCookies("screenAllow");
        removeCookies(TokenKey.token);
        removeCookies(TokenKey.refreshToken);
        removeCookies(TokenKey.returnUrl);
        window.location.replace(DomainAdminSide + "/dang-nhap");
    }

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
    const isGroup = currentLocation.pathname === UrlCollectionCustom.Group;
    const isClientManagement = isPlan ||
                isClient ||
                isClientNote ||
                isOrder ||
                isDepositHistory || 
                isGroup;

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
                            {
                                isShowSystem ? 
                                <li className={`nav-item`}>
                                    <a className={`nav-link ${isClientManagement ? 'active' : ''}`} href="#" data-toggle="collapse" aria-expanded={isClientManagement} data-target="#submenu-1" aria-controls="submenu-1"><i className="fas fa-file-alt fa-fw"></i>Quản lý khách hàng</a>
                                    <div id="submenu-1" className={`collapse submenu ${isClientManagement ? 'show' : ''}`}>
                                        <ul className="nav flex-column">
                                            {
                                                screens.find(item => item.code === "PLAN") ? (
                                                    <li className="nav-item">
                                                        <Link className={`nav-link ${isPlan ? 'active' : ''}`} to={UrlCollectionCustom.Plan}>Gói đăng ký</Link>
                                                    </li>
                                                ) : <></>
                                            }
                                            {
                                                screens.find(item => item.code === "CLIENT") ? (
                                                    <li className="nav-item">
                                                        <Link className={`nav-link ${isClient ? 'active' : ''}`} to={UrlCollectionCustom.Client}>Khách hàng</Link>
                                                    </li>
                                                ) : <></>
                                            }
                                            {
                                                screens.find(item => item.code === "CLIENTNOTE") ? (
                                                    <li className="nav-item">
                                                        <Link className={`nav-link ${isClientNote ? 'active' : ''}`} to={UrlCollectionCustom.ClientNote}>Lịch sử ghi chú</Link>
                                                    </li>
                                                ) : <></>
                                            }
                                            {
                                                screens.find(item => item.code === "ORDER") ? (
                                                    <li className="nav-item">
                                                        <Link className={`nav-link ${isOrder ? 'active' : ''}`} to={UrlCollectionCustom.Order}>Đơn hàng</Link>
                                                    </li>
                                                ) : <></>
                                            }
                                            {
                                                screens.find(item => item.code === "DESPOSITEHISTORY") ? (
                                                    <li className="nav-item">
                                                        <Link className={`nav-link ${isDepositHistory ? 'active' : ''}`} to={UrlCollectionCustom.DepositHistory}>Lịch sử nạp tiền</Link>
                                                    </li>
                                                ) : <></>
                                            }
                                        </ul>
                                    </div>
                                </li> : <></>
                            }
                            {
                                isShowAdmin ? (
                                    <li className={`nav-item`}>
                                        <a className={`nav-link ${isAdministrative ? 'active' : ''}`} href="#" data-toggle="collapse" aria-expanded={isAdministrative} data-target="#submenu-2" aria-controls="submenu-2"><i className="fas fa-fw fa-user-secret"></i>Quản trị viên</a>
                                        <div id="submenu-2" className={`collapse submenu ${isAdministrative ? 'show' : ''}`}>
                                            <ul className="nav flex-column">
                                                {
                                                    screens.find(item => item.code === "GROUP") ? (
                                                        <li className="nav-item">
                                                            <Link className={`nav-link ${isGroup ? 'active' : ''}`} to={UrlCollectionCustom.Group}>Nhóm người dùng</Link>
                                                        </li>
                                                    ) : <></>
                                                }
                                                {
                                                    screens.find(item => item.code === "ROLE") ? (
                                                        <li className="nav-item">
                                                            <Link className={`nav-link ${isRoleManagement ? 'active' : ''}`} to={UrlCollectionCustom.RoleManagement}>Chức vụ</Link>
                                                        </li>
                                                    ) : <></>
                                                }
                                                {
                                                    screens.find(item => item.code === "USER") ? (
                                                        <li className="nav-item">
                                                            <Link className={`nav-link ${isAccountManagement ? 'active' : ''}`} to={UrlCollectionCustom.AccountManagement}>Tài khoản</Link>
                                                        </li>
                                                    ) : <></>
                                                }
                                            </ul>
                                        </div>
                                    </li>
                                ) : <></>
                            }
                            <li className="nav-item">
                                <Link className={`nav-link ${isProfile ? 'active' : ''}`} to={UrlCollectionCustom.Profile}>
                                    <i className="fas fa-user fa-fw"></i>Thông tin tài khoản
                                </Link>
                            </li>
                            <li className={`nav-item`} onClick={onLogout}>
                                <Link className={`nav-link`} to={'#'}><i className="fas fa-sign-out-alt fa-fw"></i>Đăng xuất</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    )
}