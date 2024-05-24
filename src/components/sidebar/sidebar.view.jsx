/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, useLocation } from "react-router-dom";
import { UrlCollection } from "../../common/url-collection";
import LinkAdministratorItems from "./child-components/link-adminstrator-items.view";
import LinkSubMenu from "./child-components/link-sub-items.view";
import { useHistory } from "react-router-dom";

//--- Material Icon
import HomeIcon from "@material-ui/icons/Home";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AssignmentIcon from "@material-ui/icons/Assignment";
import * as Icons from "@material-ui/icons";
import SettingsIcon from "@material-ui/icons/Settings";
import SyncIcon from '@material-ui/icons/Sync';
//--- Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faSignOutAlt, faChevronDown, faUser } from "@fortawesome/free-solid-svg-icons";

import * as clientSettingAction from "../../redux/store/client_setting/client_setting.store";
import * as appActions from "../../core/app.store";

//--- Style
import "./sidebar.scss";

import { useMediaQuery } from "react-responsive";
import { none } from "ol/centerconstraint";
import {
  DomainAdminSide,
  TokenKey,
  getUserInfo,
  removeCookies,
  APIUrlDefault,
  setCookies,
} from "../../utils/configuration";
import * as accAction from "../../redux/store/account/account.store";
import { modules } from "../../common/profileModules";

function Sidebar(props) {
  const {
    settings,
    getSettings,
    isCollapsed,
    expandSidebar,
    collapseSidebar,
    isDirty,
    setToggle,
  } = props;
  const history = useHistory();
  const isMobile = window.innerWidth < 1281;

  const [isSubMenuOpen, setSubMenuOpen] = useState(false);
  const [openQLQH, setOpenQLQH] = useState(false);
  const [openQHHTKT, setOpenQHHTKT] = useState(false);
  const [openQHCC, setOpenQHCC] = useState(false);
  const [openSync, setOpenSync] = useState(false);

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  useEffect(() => {
    setClientSetting(settings);
  }, [settings]);

  useEffect(() => {
    if (isMobile) {
      collapseSidebar();
    }
  }, [collapseSidebar, isMobile]);

  const [clientSetting, setClientSetting] = useState();
  const currentLocation = useLocation();

  const onMouseEnter = () => {
    (isDirty || isMobile) && isCollapsed && expandSidebar();
  };

  const onMouseLeave = () => {
    (isDirty || isMobile) && collapseSidebar();
  };

  const currentIsHomePage =
    currentLocation.pathname === "/" ||
    currentLocation.pathname === UrlCollection.Dashboard;
  const currentIsPlanningAnnouncementProcessPage =
    currentLocation.pathname.includes(
      UrlCollection.PlanningAnnouncementProcess
    );
  const currentIsPlanningCCPage =
    currentLocation.pathname.includes(
      UrlCollection.PlanningCC
    );
  const currenIsSyncPage =
    currentLocation.pathname === UrlCollection.SyncUpData ||
    currentLocation.pathname === UrlCollection.SyncDownData ||
    currentLocation.pathname === UrlCollection.SyncSetting_PlanningType ||
    currentLocation.pathname === UrlCollection.SyncSetting_District;
    
  const currentIsSliderPage = currentLocation.pathname.includes(
    UrlCollection.Slider
  );
  const currentIsMapDataPage = currentLocation.pathname.includes(
    UrlCollection.MapData
  );
  const currentIsNewsPage = currentLocation.pathname.includes(
    UrlCollection.News
  );
  const currentIsDocumentManagementPage = currentLocation.pathname.includes(
    UrlCollection.DocumentManagement
  );
  const currentIsPTQD = currentLocation.pathname.includes(UrlCollection.PTQD);
  const currentIsQTHT = currentLocation.pathname.includes(UrlCollection.QTHT);
  const currentIsQHHTKT = currentLocation.pathname.includes(
    UrlCollection.QH_HTKT
  );
  const currentIsOtherPlanningPage =
    currentLocation.pathname.includes(
      UrlCollection.OtherPlanning
    );
  const currentIsAdministratorPages =
    !currentIsHomePage &&
    !currentIsPlanningAnnouncementProcessPage &&
    !currentIsPlanningCCPage &&
    // !currentIsSliderPage &&
    !currentIsMapDataPage &&
    !currentIsNewsPage &&
    !currentIsDocumentManagementPage &&
    !currentIsPTQD &&
    !currentIsQTHT &&
    !currentIsQHHTKT &&
    !currentIsOtherPlanningPage;

  const isShowQHDT = currentLocation.pathname.includes("/qhdt");
  const isShowHeThong = currentLocation.pathname.includes("/he-thong");
  const isShowPTQD = currentLocation.pathname.includes("/ptqd");

  useEffect(() => {
    setSubMenuOpen(currentIsAdministratorPages);
  }, [currentIsAdministratorPages]);

  useEffect(() => {
    setOpenQLQH(currentIsPlanningAnnouncementProcessPage);
  }, [currentIsPlanningAnnouncementProcessPage]);

  useEffect(() => {
    setOpenQHCC(currentIsPlanningCCPage);
  }, [currentIsPlanningCCPage]);

  useEffect(() => {
    setOpenQHHTKT(currentIsQHHTKT);
  }, [currentIsQHHTKT]);

  useEffect(() => {
    setOpenSync(currenIsSyncPage);
  }, [currenIsSyncPage]);

  //media query
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  const reactMediaQuery = {
    isDesktopOrLaptop: isDesktopOrLaptop,
    isBigScreen: isBigScreen,
    isTabletOrMobile: isTabletOrMobile,
    isPortrait: isPortrait,
    isRetina: isRetina
  }

  console.log('Sidebar reactMediaQuery :  ', reactMediaQuery);

  const getSideBarClassName = () => {
    var className = "";
    // Class cho desktop
    if (isDesktopOrLaptop) {
      className += 'aside';
      if (isCollapsed) {
        className += ' toggled';
      }
    }

    if (isTabletOrMobile) {
      className = 'overlay__wrapper';
      if (!isCollapsed) {
        className += '';
      }
    }
    return className;
  }

  const getSideBarInlineStyle = () => {
    //style for tablet and mobile
    if (isTabletOrMobile) {
      if (isCollapsed) {
        return { display: "none" }
      }
      return { display: "block" }
    }
  }

  const getIconMenuInlineStyle = () => {
    // var style = {alignSelf:'center', flex:'auto',display:'flex',justifyContent: 'center', flexGrow:0, flexShrink:0, flexBasis:'10%'}
    // if(isTabletOrMobile){
    //   return style;
    // }
    if (isDesktopOrLaptop) {
      if (isCollapsed) {
        return { width: '100%' }
      }
    }
  }

  const [user, setUser] = useState(getUserInfo());
  const [isLogin, setIsLogin] = useState(getUserInfo() ? true : false);
  const [screenAllow, setScreenAllow] = useState([]);

  const getScreenAllow = () => {
    accAction.GetScreenAllow().then(res => {
      setScreenAllow(modules.filter(item => {
        if (res.content.some(x => x.code === item.code))
          return item
      }))
    }).catch(error => console.log(error))
  }

    const onLogout = () => {
    removeCookies("screenAllow");
    removeCookies("isShowDialog");
    removeCookies("isLockScreen");
    removeCookies(TokenKey.token);
    removeCookies(TokenKey.refreshToken);
    removeCookies(TokenKey.returnUrl);
    window.location.replace(DomainAdminSide);
  }

  useEffect(() => {
    if (isTabletOrMobile) {
      getScreenAllow();
    }
  }, [])

  useEffect(() => {
    if (!isTabletOrMobile) return;
    if (isLogin && user && user.userRole) {
      if (user.email.toLowerCase() === "xinykien_sonla@gmail.com")
        window.location.replace(DomainAdminSide + "/dang-nhap");
      else return;
    } else {
      removeCookies("isShowDialog");
      removeCookies("isLockScreen");
      removeCookies(TokenKey.token);
      removeCookies(TokenKey.refreshToken);
      removeCookies(TokenKey.returnUrl);
      setCookies(TokenKey.returnUrl, window.location.href);
      window.location.replace(DomainAdminSide + "/dang-nhap");
    }
  }, [])

  console.log("SIDEBAR : ", user, screenAllow);

  return clientSetting ? (
    <div id="sidebar-custom" className={getSideBarClassName()}
      style={getSideBarInlineStyle()} >
      {
        isTabletOrMobile &&
        <div className="d-flex justify-content-end close-btn">
          <a href='#' onClick={() => { collapseSidebar(); setToggle(); }} >
            &times;
          </a>
        </div>
      }

      {
        isTabletOrMobile &&
        <div className="d-flex flex-column overlay__avatar-section">
          <div className="d-flex justify-content-center row overlay__avatar" style={{ width: '100%' }}>
            <a
              className="nav-link col-6"
              href="#"
              style={{textAlign: 'center'}}
            >
              <img
                className="img-profile rounded-circle"
                src={
                  user && user.avatar && user.avatar !== "null"
                    ? APIUrlDefault + user.avatar
                    : process.env.PUBLIC_URL + "/user-default.png"
                }
                alt="avatar-img"
                style={{ width: '50%' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = require('../../assets/images/logo.png');
                }}
              />
            </a>
          </div>
          <div className="row overlay__avatar-buttons">
            <div className="col-1">{ }</div>
            <div className="col-5 d-flex flex-column justify-content-end overlay__avatar-button"
              style={{ borderRight: 'solid 1px' }}
            >
              <FontAwesomeIcon
                icon={faUser}
                className="fa-sm fa-fw mr-2 text-gray-400"
              />
              <Link to={UrlCollection.MyAccount}>
                <span>{user && user.fullName}</span>
              </Link>
            </div>
            <div className="col-6 d-flex flex-column justify-content-start overlay__avatar-button"
              onClick={onLogout} style={{ borderLeft: 'solid 1px' }}
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="fa-sm fa-fw mr-2 text-gray-400"
              />
              <a href={DomainAdminSide + "/dang-nhap"}>
                <span>Đăng xuất</span>
              </a>
            </div>
          </div>
        </div>
      }

      <div
        onMouseEnter={isDesktopOrLaptop ? onMouseEnter : () => { }}
        onMouseLeave={isDesktopOrLaptop ? onMouseLeave : () => { }}
      >
        <ul
          className={
            (isDesktopOrLaptop ? "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion aside__menu" : "") +
            (isTabletOrMobile ? "overlay__menu-list" : "") +
            ((isCollapsed && isDesktopOrLaptop) ? " toggled" : "")
          }
          id="accordionSidebar"
        >
          {isDesktopOrLaptop && <hr className="sidebar-divider my-0" />}

          {isShowQHDT && (
            <>
              <li className="nav-item overlay__menu__item">
                <div className={`nav-link overlay__menu-link__wrapper ${currentIsHomePage && "is-active"}`} style={!isCollapsed ? { display: 'flex', width: '100%' } : {}}
                  onClick={() => {
                    setSubMenuOpen(false)
                  }}
                >
                  <div className="overlay__menu-link__icon" style={getIconMenuInlineStyle()}>
                    <HomeIcon fontSize="small" className="mr-2" />
                  </div>
                  <Link to="/qhdt/dashboard">
                    {!isCollapsed && <span>Dashboard</span>}
                  </Link>
                </div>
              </li>
              {isDesktopOrLaptop && <hr className="sidebar-divider mb-0" />}
              <li className={`nav-item overlay__menu__item ${openQLQH && !isCollapsed ? "is-open" : ""}`}>
                <div className="overlay__submenu-list__wrapper">
                  <div className={`nav-link overlay__submenu-list__title-wrapper ${currentIsPlanningAnnouncementProcessPage && "is-active"}`}
                    onClick={() => {
                      history.push(UrlCollection.PlanningAnnouncementProcess);
                      setOpenQLQH(!openQLQH);
                    }}
                  >
                    <div className="overlay__submenu-list__title-icon aside__submenu-list__title-icon">
                      <AssignmentIcon fontSize="small" className="mr-2" />
                    </div>
                    <a to={UrlCollection.PlanningAnnouncementProcess}
                    // style={isTabletOrMobile ? {display:'flex',justifyContent: 'start'} : {}}
                    >
                      {!isCollapsed && <span>Quản lý quy hoạch</span>}
                    </a>
                    {!isCollapsed ? (
                      <span className="overlay__submenu-list__title-chevron aside__submenu-list__title-chevron">
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="float-right mt-1 chevron"
                        />
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className="float-right mt-1 chevron"
                        />
                      </span>
                    ) : null}
                  </div>

                  <div className="overlay__submenu-list__content-wrapper">
                    {/* {
                      isTabletOrMobile && <div className="overlay__submenu-list__content-blank-div"></div>
                    } */}
                    <ul className="aside__menu-sub overlay__submenu-list__content">
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.LinkMapProcess}
                          title="Bản đồ"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.ConsultTheCommunity}
                          title="Xin ý kiến"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.PlanningRelate}
                          title="Quy hoạch liên quan"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.DocumentSetting}
                          title="Quản lý hồ sơ"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.QHTNews}
                          title="Tin tức"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.QHTPlanningTypes}
                          title="Chuyên mục"
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className={`nav-item overlay__menu__item ${openQHCC && !isCollapsed ? "is-open" : ""}`}>
                <div className="overlay__submenu-list__wrapper">
                  <div className={`nav-link overlay__submenu-list__title-wrapper ${currentIsPlanningCCPage && "is-active"}`}
                    onClick={() => {
                      history.push(UrlCollection.PlanningCC);
                      setOpenQHCC(!openQHCC);
                    }}
                  >
                    <div className="overlay__submenu-list__title-icon aside__submenu-list__title-icon">
                      <AssignmentIcon fontSize="small" className="mr-2" />
                    </div>
                    <a to={UrlCollection.PlanningCC} >
                      {!isCollapsed && <span>Quy hoạch các cấp</span>}
                    </a>
                    {!isCollapsed ? (
                      <span className="overlay__submenu-list__title-chevron aside__submenu-list__title-chevron">
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="float-right mt-1 chevron"
                        />
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className="float-right mt-1 chevron"
                        />
                      </span>
                    ) : null}
                  </div>
                  <div className="overlay__submenu-list__content-wrapper">
                    {/* {
                      isTabletOrMobile && <div className="overlay__submenu-list__content-blank-div"></div>
                    } */}
                    <ul className="aside__menu-sub overlay__submenu-list__content">
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.LinkMapPlanningCC}
                          title="Bản đồ"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.ConsultPlanningCC}
                          title="Xin ý kiến"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.PlanningCCRelate}
                          title="Quy hoạch liên quan"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.DocumentPlanningCC}
                          title="Quản lý hồ sơ"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.QHCCNews}
                          title="Tin tức"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.QHCCPlanningTypes}
                          title="Chuyên mục"
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className={`nav-item overlay__menu__item ${openQHHTKT && !isCollapsed ? "is-open" : ""}`}>
                <div className="overlay__submenu-list__wrapper">
                  <div className={`nav-link overlay__submenu-list__title-wrapper ${currentIsQHHTKT && "is-active"}`}
                    onClick={() => {
                      history.push(UrlCollection.QH_HTKT);
                      setOpenQHHTKT(!openQHHTKT);
                    }}
                  >
                    <div className="overlay__submenu-list__title-icon aside__submenu-list__title-icon">
                      <AssignmentIcon fontSize="small" className="mr-2" />
                    </div>
                    <a to={UrlCollection.QH_HTKT}>
                      {!isCollapsed && <span>Nội dung QH hạ tầng kỹ thuật</span>}
                    </a>
                    {!isCollapsed ? (
                      <span className="overlay__submenu-list__title-chevron aside__submenu-list__title-chevron">
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="float-right mt-1 chevron"
                        />
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className="float-right mt-1 chevron"
                        />
                      </span>
                    ) : null}
                  </div>
                  <div className="overlay__submenu-list__content-wrapper">
                    {/* {
                      isTabletOrMobile && <div className="overlay__submenu-list__content-blank-div"></div>
                    } */}
                    <ul className="aside__menu-sub overlay__submenu-list__content">
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.QH_HTKT_LINK_MAP}
                          title="Bản đồ"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.QH_HTKT_CONSULT}
                          title="Xin ý kiến"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.QH_HTKT_Relate}
                          title="Quy hoạch liên quan"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.QH_HTKT_SETUP_DOCUMENT}
                          title="Quản lý hồ sơ"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.QHHTKTNews}
                          title="Tin tức"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.QHHTKTPlanningTypes}
                          title="Chuyên mục"
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="nav-item overlay__menu__item">
                <div className={`nav-link overlay__menu-link__wrapper ${currentIsOtherPlanningPage && "is-active"}`} style={!isCollapsed ? { display: 'flex', width: '100%', borderBottom: `${isDesktopOrLaptop ? '' : 'solid 1px'}` } : {}}
                  onClick={() => {
                    history.push(UrlCollection.OtherPlanning);
                  }}
                >
                  <div className="overlay__menu-link__icon" style={getIconMenuInlineStyle()}>
                    <AssignmentIcon fontSize="small" className="mr-2" />
                  </div>
                  <a to={UrlCollection.OtherPlanning} style={isTabletOrMobile ? { fontSize: '0.85rem' } : {}}>
                    {!isCollapsed && <span>Quy hoạch khác</span>}
                  </a>
                </div>
              </li>
              <li className={`nav-item overlay__menu__item ${openSync && !isCollapsed ? "is-open" : ""}`}>
                <div className="overlay__submenu-list__wrapper">
                  <div className={`nav-link overlay__submenu-list__title-wrapper ${openSync && "is-active"}`}
                    onClick={() => {
                      //history.push(UrlCollection.SyncUpData);
                      setOpenSync(!openSync);
                    }}
                  >
                    <div className="overlay__submenu-list__title-icon aside__submenu-list__title-icon">
                      <SyncIcon fontSize="small" className="mr-2" />
                    </div>
                    {/* <a to={UrlCollection.SyncUpData}>
                        {!isCollapsed && <span>Đồng bộ dữ liệu</span>}
                      </a> */}
                    {!isCollapsed ? (
                      <><span>Đồng bộ dữ liệu</span>
                      <span className="overlay__submenu-list__title-chevron aside__submenu-list__title-chevron">
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="float-right mt-1 chevron"
                        />
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className="float-right mt-1 chevron"
                        />
                      </span></>
                    ) : null}
                  </div>
                  <div className="overlay__submenu-list__content-wrapper">
                    {/* {
                      isTabletOrMobile && <div className="overlay__submenu-list__content-blank-div"></div>
                    } */}
                    <ul className="aside__menu-sub overlay__submenu-list__content">
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.SyncUpData}
                          title="Đồng bộ lên hệ thống"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.SyncDownData}
                          title="Đồng bộ từ hệ thống"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.SyncSetting_PlanningType}
                          title="Cài đặt nguyên tắc đồng bộ - Chuyên mục"
                        />
                      </li>
                      <li>
                        <LinkSubMenu
                          pageLink={UrlCollection.SyncSetting_District}
                          title="Cài đặt nguyên tắc đồng bộ - Quận/ huyện"
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </>
          )}
          {/* <li className="nav-item">
            <Link
              target="_blank"
              className={`nav-link`}
              //to={UrlCollection.PAHT}
              to={{ pathname: UrlCollection.PAHT }}
            >
              <PostAddIcon fontSize="small" className="mr-2" />
              {!isCollapsed && <span>Phản ánh hiện trường</span>}
            </Link>
          </li> */}
          {isShowPTQD && (
            <li className="nav-item overlay__menu__item">
              <div className={`nav-link overlay__menu-link__wrapper ${currentIsPTQD && "is-active"}`} style={!isCollapsed ? { display: 'flex', width: '100%'} : {}}
                onClick={() => setSubMenuOpen(false)}
              >
                <div className="overlay__menu-link__icon" style={getIconMenuInlineStyle()}>
                  <AssignmentIcon fontSize="small" className="mr-2" />
                </div>
                <Link to={UrlCollection.Analysis} style={isTabletOrMobile ? { fontSize: '0.85rem' } : {}}>
                  {!isCollapsed && <span>Chuyên mục</span>}
                </Link>
              </div>
              <div className={`nav-link overlay__menu-link__wrapper ${currentIsPTQD && "is-active"}`} style={!isCollapsed ? { display: 'flex', width: '100%', borderBottom: `${isDesktopOrLaptop ? '' : 'solid 1px'}`} : {}}
                onClick={() => setSubMenuOpen(false)}
              >
                <div className="overlay__menu-link__icon" style={getIconMenuInlineStyle()}>
                  <Icons.CompareArrowsRounded fontSize="small" className="mr-2" />
                </div>
                <Link to={UrlCollection.StatisticsOfObjects} style={isTabletOrMobile ? { fontSize: '0.85rem' } : {}}>
                  {!isCollapsed && <span>Phân tích các đối tượng liên quan</span>}
                </Link>
              </div>
              <div className={`nav-link overlay__menu-link__wrapper ${currentIsPTQD && "is-active"}`} style={!isCollapsed ? { display: 'flex', width: '100%', borderBottom: `${isDesktopOrLaptop ? '' : 'solid 1px'}`} : {}}
                onClick={() => setSubMenuOpen(false)}
              >
                <div className="overlay__menu-link__icon" style={getIconMenuInlineStyle()}>
                  <Icons.Map fontSize="small" className="mr-2" />
                </div>
                <Link to={UrlCollection.SearchObjectsOnMap} style={isTabletOrMobile ? { fontSize: '0.85rem' } : {}}>
                  {!isCollapsed && <span>Tìm kiếm đối tượng trên bản đồ</span>}
                </Link>
              </div>
            </li>
          )}
          {/* {isShowQHDT && (
            <li className="nav-item">
              <Link
                className={`nav-link ${currentIsNewsPage && "is-active"}`}
                to={UrlCollection.News}
                onClick={() => setSubMenuOpen(false)}
              >
                <PostAddIcon fontSize="small" className="mr-2" />
                {!isCollapsed && <span>Tin tức</span>}
              </Link>
            </li>
          )} */}
          {isShowHeThong && (
            <li className={`nav-item overlay__menu__item ${isSubMenuOpen && !isCollapsed ? "is-open" : ""}`}>
              <div className="overlay__submenu-list__wrapper">
                <div className={`nav-link overlay__submenu-list__title-wrapper ${currentIsAdministratorPages && "is-active"}`}
                  onClick={() => {
                    history.push(UrlCollection.EmailTemplate);
                    setSubMenuOpen(!isSubMenuOpen);
                  }}
                >
                  <div className="overlay__submenu-list__title-icon aside__submenu-list__title-icon">
                    <SettingsIcon fontSize="small" className="mr-2" />
                  </div>
                  <a to={'#'}
                  // style={isTabletOrMobile ? {display:'flex',justifyContent: 'start'} : {}}
                  >
                    {!isCollapsed && <span>Administrator</span>}
                  </a>
                  {!isCollapsed ? (
                    <span className="overlay__submenu-list__title-chevron aside__submenu-list__title-chevron">
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="float-right mt-1 chevron"
                      />
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="float-right mt-1 chevron"
                      />
                    </span>
                  ) : null}
                </div>
                <div className="overlay__submenu-list__content-wrapper">
                  {/* {
                    isTabletOrMobile ? <div className="overlay__submenu-list__content-blank-div"></div> : null
                  } */}
                  <ul className="aside__menu-sub overlay__submenu-list__content">
                    <li>
                      <LinkAdministratorItems
                        // icon={EmailIcon}
                        pageLink={UrlCollection.EmailTemplate}
                        title="Email Template"
                      />
                    </li>
                    <li>
                      <LinkAdministratorItems
                        // icon={AllInboxIcon}
                        pageLink={UrlCollection.EmailGenerated}
                        title="Khởi tạo email"
                      />
                    </li>
                    <li>
                      <LinkAdministratorItems
                        // icon={ContactPhoneIcon}
                        pageLink={UrlCollection.ContactManagement}
                        title="Liên hệ"
                      />
                    </li>
                    <li>
                      <LinkAdministratorItems
                        //  icon={PeopleIcon}
                        pageLink={UrlCollection.RoleManagement}
                        title="Chức vụ"
                      />
                    </li>
                    <li>
                      <LinkAdministratorItems
                        //  icon={AccountBoxIcon}
                        pageLink={UrlCollection.Log}
                        title="Quản lý log"
                      />
                    </li>
                    <li>
                      <LinkAdministratorItems
                        //  icon={AccountBoxIcon}
                        pageLink={UrlCollection.UserManagement}
                        title="Quản lý người dùng"
                      />
                    </li>
                    <li>
                      <LinkAdministratorItems
                        //   icon={() => <img className="mr-2 mt-n1" src={require("../../assets/icon/commune.png")} alt="commune" />}
                        pageLink={UrlCollection.CommuneManagement}
                        title="Quản lý xã/phường"
                      />
                    </li>
                    <li>
                      <LinkAdministratorItems
                        //   icon={() => <img className="mr-2 mt-n1" src={require("../../assets/icon/district.png")} alt="district" />}
                        pageLink={UrlCollection.DistrictManagement}
                        title="Quản lý quận/huyện"
                      />
                    </li>
                    <li>
                      <LinkAdministratorItems
                        //   icon={() => <img className="mr-2 mt-n1" src={require("../../assets/icon/province.png")} alt="province" />}
                        pageLink={UrlCollection.ProvinceManagement}
                        title="Quản lý tỉnh/thành phố"
                      />
                    </li>
                    <li>
                      <LinkAdministratorItems
                        //   icon={() => <img className="mr-2 mt-n1" src={require("../../assets/icon/group-links.png")} alt="group-links" />}
                        pageLink={UrlCollection.LinkGroup}
                        title="Danh sách nhóm"
                      />
                    </li>
                    <li>
                      <LinkAdministratorItems
                        //   icon={() => <img className="mr-2 mt-n1" src={require("../../assets/icon/link.png")} alt="link" />}
                        pageLink={UrlCollection.ServiceLink}
                        title="Danh sách liên kết"
                      />
                    </li>
                    <li>
                      <LinkAdministratorItems
                        //  icon={HistoryIcon}
                        pageLink={UrlCollection.UserLogHistory}
                        title="Nhật ký người dùng"
                      />
                    </li>
                    {/* <li>
                  <LinkAdministratorItems
                    // icon={ViewComfyIcon}
                    pageLink={UrlCollection.LandType}
                    title="Quản lý loại đất"
                  />
                </li> */}
                    {/* <li>
                  <LinkAdministratorItems
                    // icon={ViewAgendaIcon}
                    pageLink={UrlCollection.LandTypeDetail}
                    title="Quản lý chi tiết loại đất"
                  />
                </li> */}
                    <li>
                      <LinkAdministratorItems
                        //  icon={CallToActionIcon}
                        pageLink={UrlCollection.OpinionForm}
                        title="Tạo form ý kiến"
                      />
                    </li>
                    {/* <li>
                  <LinkAdministratorItems
                    //  icon={TableChartIcon}
                    pageLink={UrlCollection.TableStructure}
                    title="Sửa cấu trúc bảng"
                  />
                </li> */}
                    <li>
                      <LinkAdministratorItems
                        pageLink={UrlCollection.PlanningUnit}
                        title="Đơn vị lập quy hoạch"
                      />
                    </li>
                    <li>
                      <LinkAdministratorItems
                        pageLink={UrlCollection.Investor}
                        title="Chủ đầu tư"
                      />
                    </li>
                    <li>
                      <LinkAdministratorItems
                        pageLink={UrlCollection.ApprovalAgency}
                        title="Cơ quan phê duyệt"
                      />
                    </li>
                    <li>
                      <LinkAdministratorItems
                        pageLink={UrlCollection.Slider}
                        title="Slider"
                      />
                    </li>
                  </ul>
                </div>
              </div>

              {/* <div className={`nav-link ${currentIsAdministratorPages && "is-active"}`} style={!isCollapsed ? {display: 'flex',width: '100%'} : {}} 
                onClick={() => {
                  history.push(UrlCollection.EmailTemplate);
                  setSubMenuOpen(!isSubMenuOpen);
                }}
              >
                <div style={isTabletOrMobile ? {alignSelf:'center', flex:'auto',display:'flex',justifyContent: 'center', flexGrow:0, flexShrink:0, flexBasis:'10%'} : {}}>
                  <SettingsIcon fontSize="small" className="mr-2" />
                </div>
                <a href="#">
                  {!isCollapsed && <span>Administrator</span>}
                </a>
                {!isCollapsed ? (
                  <span style={isTabletOrMobile ? {fontSize:'xx-large', alignSelf:'center', flex:'auto'} : {}}>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="float-right mt-1 chevron"
                    />
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="float-right mt-1 chevron"
                    />
                  </span>
                ) : null}
              </div> */}
            </li>
          )}

          {isDesktopOrLaptop && <hr className="sidebar-divider d-none d-md-block" />}

          {isTabletOrMobile && (
            screenAllow.map((x, index) => (
              <li key={`nav-key-${index}`} className="nav-item overlay__menu__item">
                <div className={`nav-link overlay__menu-link__wrapper ${currentIsPTQD && "is-active"}`} style={!isCollapsed ? { display: 'flex', width: '100%' } : {}}
                  onClick={() => setSubMenuOpen(false)}
                >
                  <div style={isTabletOrMobile ? { alignSelf: 'center', flex: 'auto', display: 'flex', justifyContent: 'center', flexGrow: 0, flexShrink: 0, flexBasis: '10%' } : {}}>
                    {/* <AssignmentIcon fontSize="small" className="mr-2" /> */}
                    <img
                      src={x.logo}
                      alt="Folder"
                      style={{ width: 15, height: 15 }}
                    />
                  </div>
                  <a href={x.url} target={x.url === UrlCollection.PAHT ? "_blank" : ""} style={{ fontSize: '0.85rem' }}>
                    {x.title}
                  </a>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className={(isTabletOrMobile ? ' footer-menu-mobile' : ' d-flex flex-column sidebar sidebar-dark w-100')}>
        <div class="copyright">
          <p>{clientSetting?.copyright}</p>
        </div>
      </div>
    </div>
  ) : null;
}

const mapStateToProps = (state) => ({
  settings: state.clientSetting.clientSetting,
  isCollapsed: state.app.isCollapsed,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getSettings: clientSettingAction.getSettings,
      expandSidebar: appActions.ExpandSidebar,
      collapseSidebar: appActions.CollapseSidebar,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
