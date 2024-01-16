/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import {
  DomainAdminSide,
  TokenKey,
  getUserInfo,
  removeCookies,
  APIUrlDefault,
  setCookies,
} from "../../utils/configuration";
import { Link } from "react-router-dom";
import { UrlCollection } from "../../common/url-collection";
import * as clientSettingAction from "../../redux/store/client_setting/client_setting.store";
import * as accAction from "../../redux/store/account/account.store";
import * as appActions from "../../core/app.store";
import { modules } from "../../common/profileModules";

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: getUserInfo() ? true : false,
      user: getUserInfo(),
      screenAllow: [],
    };
    this.interval = 0;
  }

  componentDidMount() {
    this.GetScreenAllow();
  }

  GetScreenAllow() {
    accAction.GetScreenAllow().then(res => {
      this.setState({
        screenAllow: modules.filter(item => {
          if (res.content.some(x => x.code === item.code))
            return item
        })
      })
    }).catch(error => console.log(error))
  }

  UNSAFE_componentWillMount() {
    const { isLogin, user } = this.state;
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
  }

  onLogout() {
    removeCookies("isShowDialog");
    removeCookies("isLockScreen");
    removeCookies(TokenKey.token);
    removeCookies(TokenKey.refreshToken);
    removeCookies(TokenKey.returnUrl);
    window.location.replace(DomainAdminSide);
  }

  render() {
    const { user, screenAllow } = this.state;
    const { settings, setToggle, expandSidebar, collapseSidebar, isCollapsed, reactMediaQuery } = this.props;
    console.log("TOPBAR : ", user, screenAllow);
    return (
      <nav className="navbar navbar-expand navbar-light topbar static-top row" style={{ margin: 'auto' }}>
        <div className="col-6">
          <a
            className="top-bar-brand d-flex align-items-center justify-content-start  "
            href="/"
          >
            <div className="top-bar-brand-icon">
              <img
                src={process.env.PUBLIC_URL + "/logo.png"}
                alt="Logo"
                width="50"
              />
            </div>
            {settings && (
              <div className="top-bar-brand-text">{settings?.adminTitle}</div>
            )}
          </a>
        </div>
        <div className="col-6 align-items-center d-flex justify-content-end">
          {reactMediaQuery?.isTabletOrMobile ? (
            <div>
              <button
                className={"btn btn-link rounded-circle mr-3" + (isCollapsed ? " d-none" : "")}
                id="sidebarToggleCollapse"
                aria-label="top-toggle-button"
                onClick={() => {
                  collapseSidebar();
                  setToggle();
                }}
              >
                <FontAwesomeIcon icon={faBars} style={{ color: '#fff' }} />
              </button>
              <button
                className={"btn btn-link rounded-circle mr-3" + (!isCollapsed ? " d-none" : "")}
                id="sidebarToggleExpand"
                aria-label="top-toggle-button"
                onClick={() => {
                  expandSidebar();
                  setToggle();
                }}
                style={{ backgroundColor: '#fff' }}
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
            </div>
          ) : null}

          {
            reactMediaQuery?.isDesktopOrLaptop ? (
              <ul className="navbar-nav">
                <li className="nav-item dropdown no-arrow">
                  <a
                    className="nav-link dropdown-toggle "
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <img
                      className="img-profile rounded-circle"
                      src={
                        user && user.avatar && user.avatar !== "null"
                          ? APIUrlDefault + user.avatar
                          : process.env.PUBLIC_URL + "/user-default.png"
                      }
                      alt="avatar-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = require('../../assets/icon/logo.png');
                      }}
                    />
                    <div class="admin__text d-flex align-items-center">
                      <span className="mr-2 d-none d-lg-inline name">
                        {user && user.fullName}
                      </span>
                      <img className="d-none" src={require("../../assets/images/down.png")} alt="" />
                    </div>
                  </a>

                  <div
                    className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                    aria-labelledby="userDropdown"
                    style={{ width: 'auto' }}
                  >
                    {/* <a className="dropdown-item" href="#">
                      <FontAwesomeIcon icon={faUser} className="fa-sm fa-fw mr-2 text-gray-400" />Profile
                    </a> */}
                    {/* <div className="dropdown-divider"></div> */}
                    <Link className="dropdown-item" to={UrlCollection.MyAccount}>
                      <FontAwesomeIcon
                        icon={faUser}
                        className="fa-sm fa-fw mr-2 text-gray-400"
                      />
                      <span>Thông tin tài khoản</span>
                    </Link>
                    {this.state.screenAllow.map((x, index) => (
                      <a key={index} className="dropdown-item" href={x.url} target={x.url === UrlCollection.PAHT ? "_blank" : ""} >
                        <img
                          className="mr-2"
                          src={x.logo}
                          alt="Folder"
                          style={{ width: 15, height: 15 }}
                        />
                        <span>{x.title}</span>
                      </a>
                    ))}
                    <a
                      className="dropdown-item"
                      href={DomainAdminSide + "/dang-nhap"}
                      onClick={this.onLogout}
                    >
                      <FontAwesomeIcon
                        icon={faSignOutAlt}
                        className="fa-sm fa-fw mr-2 text-gray-400"
                      />
                      <span>Đăng xuất</span>
                    </a>
                  </div>
                </li>
              </ul>
            ) : null
          }

        </div>
      </nav>
    );
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
