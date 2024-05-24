import React, { Component } from "react";
import { Route, Router, Switch } from "react-router-dom";
import RouteComponent from "./route-config.jsx";
import { UrlCollection } from "./common/url-collection";
import history from "./common/history";

//--- Loading
import AppLoading from "./components/loading/loading.view";
import AppSyncLoading from "./components/loading/loading-sync.view";

//--- Layout
import LayoutCustomView from "./components/layout-custom/layout-custom.view";
import LayoutView from "./components/layout/layout.view";
import LayoutViewWithHook from "./components/layout/layout.view.withHook";
import LayoutUserView from "./components/layout/layout-user.view.jsx";

//--- Home
import Dashboard from "./modules/dashboard/dashboard.view.jsx";
//--- Admin
import Login from "./modules/login/login.view.jsx";
import ForgotPassword from "./modules/forgot-password/forgot-password.view.jsx";
import ResetPassword from "./modules/reset-password/reset-password.view.jsx";

//--- Consult the community
import EmailTemplate from "./modules/email-template/email-template";
import ContactManagement from "./modules/contact-management/contact-management.view";
import EmailGenerated from "./modules/email-generated/email-generated.view";
import UserManagement from "./modules/user-management/user-management.view";
import CommuneManagement from "./modules/communce-management/communce-management.view";
import ProviceManagement from "./modules/province-management/provice-management.view";
import DistrictManagement from "./modules/district-management/district-management.view";
import UserLogHistory from "./modules/user-log/user-log-history.view";
import LandTypeDetailManagement from "./modules/land-type-detail-management/land-type-detail-management.view";
//---Log
import Log from "./modules/log/log.jsx";

import ApprovalAgency from "./modules/approval-agency/approval-agency.view";

//--- Table Layer Structure
import TableStructure from "./modules/table-structure/table-structure.view.jsx";

//--- Access denied
import AccessDenied from "./modules/access-denied/access-denied.view.jsx";

//import DocumentManagement from "./modules/document-management/document-management.view.jsx";
import MyAccount from "./modules/my-account/my-account.view.jsx";
import PlanningUnit from "./modules/planning-unit/planning-unit.view.jsx";
import HomePage from "./modules/home/home.view.jsx";
import { QHDT } from "./modules/qhdt/qhdt.view.jsx";
import DialogWarningExpired from "./components/dialog-warning-expired/dialog-warning-expired.view";
import LockScreen from "./components/lock-screen/lock-screen.view.jsx";
// import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";


import BreadcrumbConfig from "./breadcrumb.js";
import { UrlCollectionCustom } from "./common/url-collection-custom.js";
import AccountManagement from "./pages-custom/list-account/list-account.jsx";
import axios from 'axios';
import RoleManagement from "./pages-custom/list-role/list-role.jsx";
import MyProfile from "./pages-custom/my-profile/my-profile.jsx";
import PlanManagement from "./pages-custom/list-plan/list-plan.jsx";
import ClientManagement from "./pages-custom/list-client/list-client.jsx";
import ClientNoteManagement from "./pages-custom/list-client-note/list-client-note.jsx";
import OrderManagement from "./pages-custom/list-order/list-order.jsx";
import DepositManagement from "./pages-custom/list-deposit/list-deposit.jsx";

function App() {
  //media query
  // const isDesktopOrLaptop = useMediaQuery({
  //   query: "(min-width: 1224px)",
  // });
  // const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  // const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  // const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  // const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  // const reactMediaQuery = {
  //   isDesktopOrLaptop:isDesktopOrLaptop,
  //   isBigScreen:isBigScreen,
  //   isTabletOrMobile:isTabletOrMobile,
  //   isPortrait:isPortrait,
  //   isRetina:isRetina
  // }

  return (
    <div>
      <DialogWarningExpired />
      <Router history={history}>
        <AppLoading />
        <LockScreen />
        <Switch>
          <RouteComponent
            exact
            layout={LayoutUserView}
            component={Login}
            path={UrlCollection.Login}
            isSetActive={false}
          />
          <RouteComponent
            exact
            layout={LayoutUserView}
            component={ForgotPassword}
            path={UrlCollection.ForgotPassword}
            isSetActive={false}
          />
          <RouteComponent
            exact
            layout={LayoutUserView}
            component={ResetPassword}
            path={UrlCollection.ResetPassword}
            isSetActive={false}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Dashboard">
                <Dashboard />
              </LayoutView>
            )}
            component={Dashboard}
            path={UrlCollection.Dashboard}
          />

          <RouteComponent
            exact
            layout={HomePage}
            component={HomePage}
            path={UrlCollection.Home}
          />
          <RouteComponent
            exact
            layout={QHDT}
            component={QHDT}
            path={UrlCollection.QHDT}
                  />

                  
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Email Template">
                <EmailTemplate />
              </LayoutView>
            )}
            path={UrlCollection.EmailTemplate}
          />

          {/*Email Generated */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Email Generated">
                <EmailGenerated />
              </LayoutView>
            )}
            path={UrlCollection.EmailGenerated}
          />

          {/* Role Management */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Role Management">
                <RoleManagement />
              </LayoutView>
            )}
            path={UrlCollection.RoleManagement}
          />

          {/* Contact Management */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Liên hệ">
                <ContactManagement />
              </LayoutView>
            )}
            path={UrlCollection.ContactManagement}
          />
          {/* Log */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Quản lý log">
                <Log />
              </LayoutView>
            )}
            path={UrlCollection.Log}
          />
          {/* User Management */}
          {/* <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Quản lý người dùng">
                <UserManagement />
              </LayoutView>
            )}
            path={UrlCollection.UserManagement}
          /> */}

          {/* commune Management */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Quản lý xã phường">
                <CommuneManagement />
              </LayoutView>
            )}
            path={UrlCollection.CommuneManagement}
          />

          {/* District Management */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Quản lý quận/huyện">
                <DistrictManagement />
              </LayoutView>
            )}
            path={UrlCollection.DistrictManagement}
          />

          {/* Province Management */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Quản lý tỉnh">
                <ProviceManagement />
              </LayoutView>
            )}
            component={ProviceManagement}
            path={UrlCollection.ProvinceManagement}
          />

         
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Nhật ký người dùng">
                <UserLogHistory />
              </LayoutView>
            )}
            path={UrlCollection.UserLogHistory}
          />

          
          {/* ApprovalAgency */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Cơ quan phê duyệt">
                <ApprovalAgency />
              </LayoutView>
            )}
            path={UrlCollection.ApprovalAgency}
          />

          {/* Land Type */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Quản lý chi tiết loại đất">
                <LandTypeDetailManagement />
              </LayoutView>
            )}
            path={UrlCollection.LandTypeDetail}
          />

          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Đơn vị lập quy hoạch">
                <PlanningUnit />
              </LayoutView>
            )}
            path={UrlCollection.PlanningUnit}
          />
          {/* ================================================================================================== */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutCustomView
                title="Trang chủ"
                breadcrumbList={BreadcrumbConfig.DashboardHome.breadcrumbList}
                breadcrumbActive={BreadcrumbConfig.DashboardHome.breadcrumbActive}
              >
                <div>Trang chủ </div>
              </LayoutCustomView>
            )}
            component={() => <div></div>}
            path={UrlCollectionCustom.Home}
          />

          <RouteComponent
            layout={() => (
              <LayoutCustomView
                title="Quản lý tài khoản"
                breadcrumbList={BreadcrumbConfig.Profile.breadcrumbList}
                breadcrumbActive={BreadcrumbConfig.Profile.breadcrumbActive}
              >
                <AccountManagement/>
              </LayoutCustomView>
            )}
            component={AccountManagement}
            path={UrlCollectionCustom.AccountManagement}
          />

          <RouteComponent
            layout={() => (
              <LayoutCustomView
                title="Quản lý tài khoản"
                breadcrumbList={BreadcrumbConfig.Profile.breadcrumbList}
                breadcrumbActive={BreadcrumbConfig.Profile.breadcrumbActive}
              >
                <RoleManagement/>
              </LayoutCustomView>
            )}
            component={RoleManagement}
            path={UrlCollectionCustom.RoleManagement}
          />

          <RouteComponent
            layout={() => (
              <LayoutCustomView
                title="Thông tin tài khoản"
                breadcrumbList={BreadcrumbConfig.Profile.breadcrumbList}
                breadcrumbActive={BreadcrumbConfig.Profile.breadcrumbActive}
              >
                <MyProfile/>
              </LayoutCustomView>
            )}
            component={MyProfile}
            path={UrlCollectionCustom.Profile}
          />
{/* 
    Plan: '/goi-dang-ky',
    Client: '/khach-hang',
    ClientNote: '/lich-su-ghi-chu',
    Order: '/don-hang',
    DepositHistory: '/lich-su-nap-tien', */}

          <RouteComponent
            layout={() => (
              <LayoutCustomView
                title="Quản lý gói đăng ký"
                breadcrumbList={BreadcrumbConfig.Profile.breadcrumbList}
                breadcrumbActive={BreadcrumbConfig.Profile.breadcrumbActive}
              >
                <PlanManagement/>
              </LayoutCustomView>
            )}
            component={PlanManagement}
            path={UrlCollectionCustom.Plan}
          />

          <RouteComponent
            layout={() => (
              <LayoutCustomView
                title="Quản lý khách hàng"
                breadcrumbList={BreadcrumbConfig.Profile.breadcrumbList}
                breadcrumbActive={BreadcrumbConfig.Profile.breadcrumbActive}
              >
                <ClientManagement/>
              </LayoutCustomView>
            )}
            component={ClientManagement}
            path={UrlCollectionCustom.Client}
          />

          <RouteComponent
            layout={() => (
              <LayoutCustomView
                title="Quản lý lịch sử ghi chú"
                breadcrumbList={BreadcrumbConfig.Profile.breadcrumbList}
                breadcrumbActive={BreadcrumbConfig.Profile.breadcrumbActive}
              >
                <ClientNoteManagement/>
              </LayoutCustomView>
            )}
            component={ClientNoteManagement}
            path={UrlCollectionCustom.ClientNote}
          />

          <RouteComponent
            layout={() => (
              <LayoutCustomView
                title="Đơn hàng"
                breadcrumbList={BreadcrumbConfig.Profile.breadcrumbList}
                breadcrumbActive={BreadcrumbConfig.Profile.breadcrumbActive}
              >
                <OrderManagement/>
              </LayoutCustomView>
            )}
            component={OrderManagement}
            path={UrlCollectionCustom.Order}
          />

          <RouteComponent
            layout={() => (
              <LayoutCustomView
                title="Lịch sử nạp tiền"
                breadcrumbList={BreadcrumbConfig.Profile.breadcrumbList}
                breadcrumbActive={BreadcrumbConfig.Profile.breadcrumbActive}
              >
                <DepositManagement/>
              </LayoutCustomView>
            )}
            component={DepositManagement}
            path={UrlCollectionCustom.DepositHistory}
          />

        </Switch>
      </Router>
    </div>
  );
}

export default App;
