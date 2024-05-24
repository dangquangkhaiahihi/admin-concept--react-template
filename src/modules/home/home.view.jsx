import React from "react";
import { UrlCollection } from "../../common/url-collection";
import {
  APIUrlDefault,
  DomainAdminSide,
  getUserInfo,
  removeCookies,
  setCookies,
  TokenKey,
} from "../../utils/configuration";
import "./home.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { modules } from "../../common/profileModules";
import * as accAction from "../../redux/store/account/account.store";

class HomePage extends React.Component {
  constructor(props) {
    console.log("HomePage props : ", props);
    super(props);
    this.state = {
      isLogin: getUserInfo() ? true : false,
      user: getUserInfo(),
      screenAllow: [],
    };
  }

  componentDidMount() {
    if(this.state.isLogin) {
      this.GetScreenAllow();
    }
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
      if (user.email.toLowerCase() == "xinykien_sonla@gmail.com")
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
  render() {
    const { user } = this.state;
    const {
      reactMediaQuery
    } = this.props

    const renderLogo = () => {
      return (
        <img
          src={process.env.PUBLIC_URL + "/logo.png"}
          alt="Logo"
          width="70"
        />
      )
    }

    const renderTitle = () => {
      return (
        <div className="custom-title font-weight-bold">
        CSKH
        </div>
      )
    }
    
    const renderNavigationBox = () => {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown no-arrow">
            <a
              className="nav-link dropdown-toggle d-flex"
              href="#"
              id="userDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <img
                className="img-profile rounded-circle"
                style={{ width: 50, height: 50 }}
                src={
                  user && user.avatar && user.avatar !== "null"
                    ? APIUrlDefault + user.avatar
                    : process.env.PUBLIC_URL + "/user-default.png"
                }
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = require('../../assets/images/logo.png');
                }}
              />
              <div className="admin__text d-flex align-items-center">
                <span className="mr-2 text-secondary font-weight-bold d-lg-inline name">
                  {user && user.fullName}
                </span>
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className="text-secondary"
                />
              </div>
            </a>

            <div
              className="dropdown-menu dropdown-menu-right shadow mr-1"
              aria-labelledby="userDropdown"
            >
              <Link className="dropdown-item" to={UrlCollection.MyAccount}>
                <FontAwesomeIcon
                  icon={faUser}
                  className="fa-sm fa-fw mr-2 text-gray-400"
                />
                Thông tin tài khoản
              </Link>
              {this.state.screenAllow.map((x,_i) => (
                <a key={_i} className="dropdown-item" href={x.url} target={x.url === UrlCollection.PAHT ? "_blank" : ""}>
                  <img
                    src={x.logo}
                    alt="Folder"
                    style={{ width: 15, height: 15 }}
                  />
                  <span className="ml-2">{x.title}</span>
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
                Đăng xuất
              </a>
            </div>
          </li>
        </ul>
      )
    }

    return (
      <div className="container bg-white wrapper">
        {
          //Desktop 
          (reactMediaQuery?.isDesktopOrLaptop) &&
          <div className="row">
            <div className="col-8 row">
              <div className="col-md-3 pb-3">
                {renderLogo()}
              </div>
              <div className="col-md-9">
                {renderTitle()}
              </div>
            </div>
            <div className="col-4 d-flex justify-content-end">
              {renderNavigationBox()}
            </div>
          </div>
        }
        {
          //Mobile/ Tablet
          (reactMediaQuery?.isTabletOrMobile) &&
          <div className="row">
            <div className="col-12 row">
              <div className="col-6 pb-3 d-flex justify-content-start">
                {renderLogo()}
              </div>
              <div className="col-6 d-flex justify-content-end">
                {renderNavigationBox()}
              </div>
            </div>
            <div className="col-12 d-flex justify-content-center">
              {renderTitle()}
            </div>
          </div>
        }
        <div className="row module-box mt-5 justify-content-center">
          {this.state.screenAllow.map((x,index) => (
            <div 
              key={index}
              className={
                `text-decoration-none align-items-center mb-3 
                ${reactMediaQuery?.isDesktopOrLaptop && 'col-3 w-25'} 
                ${(reactMediaQuery?.isTabletOrMobile && !reactMediaQuery?.isPortrait) && 'col-6 w-50'} 
                ${(reactMediaQuery?.isTabletOrMobile && reactMediaQuery?.isPortrait) && 'col-12'}`
              }
            >
            <a
              key={index}
              href={x.url}
              className={`align-items-center card`}
              target={x.url === UrlCollection.PAHT ? "_blank" : ""}
            >
              <img
                src={x.logo}
                alt="Folder"
                style={{ width: 60, height: 60, marginTop: 20 }}
              />
              <div className="card-body  m-2 ml-2">{x.title}</div>
            </a></div>
          ))}
        </div>
      </div>
    );
  }
}

export default HomePage;
