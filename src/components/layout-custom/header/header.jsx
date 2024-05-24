import React, { useEffect, useState, useRef } from 'react';
import {
    DomainAdminSide,
    TokenKey,
    getUserInfo,
    removeCookies,
    APIUrlDefault,
    setCookies,
    NotificationMessageType,
} from "../../../utils/configuration";
import { Link } from 'react-router-dom';
import * as viVN from "../../../language/vi-VN.json";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { UrlCollectionCustom } from '../../../common/url-collection-custom';

export default function HeaderCustom() {

    const [user, setUser] = useState(getUserInfo());
    const [open, setOpen] = useState();
    const [updateItem, setUpdateItem] = useState();
    const [triggerSubmit, setTriggerSubmit] = useState(false);

    //const buttonCloseRef = useRef(null);
    const onCloseModal = () => {
        //buttonCloseRef.current.click();
        setUpdateItem(null);
        setOpen(false);
    }

    const onOpenModal = () => {
        //buttonCloseRef.current.click();
        setOpen(true);
        console.log(updateItem);
    }

    const onLogout = () => {
        removeCookies("isShowDialog");
        removeCookies("isLockScreen");
        removeCookies("screenAllow");
        removeCookies(TokenKey.token);
        removeCookies(TokenKey.refreshToken);
        removeCookies(TokenKey.returnUrl);
        window.location.replace(DomainAdminSide + "/dang-nhap");
    }

    return (
        <>
        <div className="dashboard-header">
            <nav className="navbar navbar-expand-lg bg-white fixed-top">
                    <a className="navbar-brand" href="/">PHẦN MỀM CSKH</a>
                <a className="nav-link nav-user-img navbar-toggler" href="#" id="navbarDropdownMenuLink_mobile" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src={(!user || !user.avatar) ? "assets/images/avatar.png" : APIUrlDefault + user.avatar} alt="" className="user-avatar-md rounded-circle"/></a>
                <div className="dropdown-menu dropdown-menu-right nav-user-dropdown" aria-labelledby="navbarDropdownMenuLink_mobile">
                    <div className="nav-user-info">
                            <h5 className="mb-0 text-white nav-user-name">{user?.fullName} </h5>
                        {/*<span className="status"></span><span className="ml-2">Available</span>*/}
                    </div>
                    <Link className="dropdown-item" to={UrlCollectionCustom.Profile}><i className="fas fa-user mr-2"></i>Tài khoản</Link>
                    {/*<a className="dropdown-item" href="#"><i className="fas fa-cog mr-2"></i>Thiết lập</a>*/ }
                    <a className="dropdown-item" href="#" onClick={onLogout}><i className="fas fa-power-off mr-2"></i>Đăng xuất</a>
                </div>
                
                <div className="collapse navbar-collapse " id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto navbar-right-top">
                        {/* <li className="nav-item">
                            <div id="custom-search" className="top-search-bar">
                                <input className="form-control" type="text" placeholder="Search.."/>
                            </div>
                        </li> */}
                            
                            {/*
                            <li className="nav-item dropdown notification">
                            <a className="nav-link nav-icons" href="#" id="navbarDropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fas fa-fw fa-bell"></i> <span className="indicator"></span></a>
                            <ul className="dropdown-menu dropdown-menu-right notification-dropdown">
                                <li>
                                    <div className="notification-title">Thông báo</div>
                                    <div className="notification-list">
                                        <div className="list-group">
                                            <a href="#" className="list-group-item list-group-item-action active">
                                                <div className="notification-info" style={{backgroundColor: "unset", borderColor:"unset", borderLeft:"0px"} }>

                                                    <div className="notification-list-user-block"><span className="notification-list-user-name">Jeremy Rakestraw</span>accepted your invitation to join the team.
                                                        <div className="notification-date">2 min ago</div>
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#" className="list-group-item list-group-item-action">
                                                <div className="notification-info" style={{backgroundColor: "unset", borderColor:"unset", borderLeft:"0px"} }>
                                                    <div className="notification-list-user-img"><img src="assets/images/avatar-3.jpg" alt="" className="user-avatar-md rounded-circle"/></div>
                                                    <div className="notification-list-user-block"><span className="notification-list-user-name">John Abraham </span>is now following you
                                                        <div className="notification-date">2 days ago</div>
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#" className="list-group-item list-group-item-action">
                                                <div className="notification-info" style={{backgroundColor: "unset", borderColor:"unset", borderLeft:"0px"} }>
                                                    <div className="notification-list-user-img"><img src="assets/images/avatar-4.jpg" alt="" className="user-avatar-md rounded-circle"/></div>
                                                    <div className="notification-list-user-block"><span className="notification-list-user-name">Monaan Pechi</span> is watching your main repository
                                                        <div className="notification-date">2 min ago</div>
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#" className="list-group-item list-group-item-action">
                                                <div className="notification-info" style={{backgroundColor: "unset", borderColor:"unset", borderLeft:"0px"} }>
                                                    <div className="notification-list-user-img"><img src="assets/images/avatar-5.jpg" alt="" className="user-avatar-md rounded-circle"/></div>
                                                    <div className="notification-list-user-block"><span className="notification-list-user-name">Jessica Caruso</span>accepted your invitation to join the team.
                                                        <div className="notification-date">2 min ago</div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                        <div className="list-footer"> <a href="#" onClick={() => { onOpenModal() }}>Báo cáo sự cố</a></div>
                                </li>
                            </ul>
                        </li>

                            <li className="nav-item dropdown connection">
                            <a className="nav-link" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="fas fa-fw fa-th"></i> </a>
                            <ul className="dropdown-menu dropdown-menu-right connection-dropdown">
                                <li className="connection-list">
                                    <div className="row">
                                        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 ">
                                            <a href="#" className="connection-item"><img src="assets/images/github.png" alt=""/> <span>Github</span></a>
                                        </div>
                                        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 ">
                                            <a href="#" className="connection-item"><img src="assets/images/dribbble.png" alt=""/> <span>Dribbble</span></a>
                                        </div>
                                        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 ">
                                            <a href="#" className="connection-item"><img src="assets/images/dropbox.png" alt=""/> <span>Dropbox</span></a>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 ">
                                            <a href="#" className="connection-item"><img src="assets/images/bitbucket.png" alt=""/> <span>Bitbucket</span></a>
                                        </div>
                                        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 ">
                                            <a href="#" className="connection-item"><img src="assets/images/mail_chimp.png" alt=""/><span>Mail chimp</span></a>
                                        </div>
                                        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 ">
                                            <a href="#" className="connection-item"><img src="assets/images/slack.png" alt=""/> <span>Slack</span></a>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="conntection-footer"><a href="#">More</a></div>
                                </li>
                            </ul>
                        </li>
                        */}
                        {/* <li className="nav-item">
                            <a className="nav-link nav-icons" href="/huong-dan" target="huong_dan">
                                <i className="fas fa-question-circle text-info">Hướng dẫn</i> 
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link nav-icons" href="#" onClick={() => { onOpenModal() }}>
                                <i className=" fas fa-comment"></i> Sự cố
                            </a>
                        </li> */}
                        <li className="nav-item dropdown nav-user">
                            <a className="nav-link nav-user-img" href="#" id="navbarDropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src={(!user || !user.avatar) ? "assets/images/avatar.png" : APIUrlDefault + user.avatar} alt="" className="user-avatar-md rounded-circle"/></a>
                            <div className="dropdown-menu dropdown-menu-right nav-user-dropdown" aria-labelledby="navbarDropdownMenuLink2">
                                <div className="nav-user-info">
                                        <h5 className="mb-0 text-white nav-user-name">{user?.fullName}</h5>
                                    {/*<span className="status"></span><span className="ml-2">Available</span>*/}
                                </div>
                                <Link className="dropdown-item" to={UrlCollectionCustom.Profile}><i className="fas fa-user mr-2"></i>Tài khoản</Link>
                                {/*<a className="dropdown-item" href="#"><i className="fas fa-cog mr-2"></i>Thiết lập</a>*/ }
                                <a className="dropdown-item" href="#" onClick={onLogout}><i className="fas fa-power-off mr-2"></i>Đăng xuất</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
            </div>
        </>
    )
}