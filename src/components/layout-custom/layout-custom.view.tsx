import React, { useEffect, useState } from 'react';
import LoadingScreen from '../loading-with-queue/loading-with-queue';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HeaderCustom from './header/header';
import SideBarCustom from './side-bar/side-bar';
import FooterCustom from './footer/footer';
import PageTitleCustom from './page-title/page-title';
import { DomainAdminSide, TokenKey, getUserInfo, removeCookies, setCookies } from '../../utils/configuration';
import * as accAction from "../../redux/store/account/account.store";

function LayoutCustomView (props: any) {
  const { title, breadcrumbList, breadcrumbActive } = props;
  const [isLogin, setIsLogin] = useState(getUserInfo() ? true : false);
  const [user, setUser] = useState(getUserInfo());
  const [screenAllow, setScreenAllow] = useState([]);

  function GetScreenAllow() {
    accAction.GetScreenAllow().then(res => {
      // setScreenAllow(modules.filter(item => {
      //   if (res.content.some(x => x.code === item.code))
      //     return item
      // }))
    }).catch(error => console.log(error))
  }

  useEffect(() => {
    if( isLogin ) {
      //GetScreenAllow();
    }
    if (isLogin && user && user.userRole) {
    } else {
      removeCookies("isShowDialog");
      removeCookies("isLockScreen");
      removeCookies(TokenKey.token);
      removeCookies(TokenKey.refreshToken);
      removeCookies(TokenKey.returnUrl);
      setCookies(TokenKey.returnUrl, window.location.href);
      window.location.replace(DomainAdminSide + "/dang-nhap");
    }
  })
  return (
    <div className='dashboard-main-wrapper'>
      <LoadingScreen />
      <HeaderCustom />
      <SideBarCustom />

      <div className="dashboard-wrapper left-sidebar-animation">
        <div className="container-fluid dashboard-content">
          <PageTitleCustom
            title={title}
            breadcrumbList={breadcrumbList}
            breadcrumbActive={breadcrumbActive}
          />
          {props.children}
        </div>
        <FooterCustom />
      </div>
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  isCollapsed: state.app.isCollapsed,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LayoutCustomView);
