import React from "react";
import { Router, Switch } from "react-router-dom";
import RouteComponent from "./route-config.jsx";
import { UrlCollection } from "./common/url-collection";
import history from "./common/history";

//--- Loading
import AppLoading from "./components/loading/loading.view";

//--- Layout
import LayoutView from "./components/layout/layout.view";
import LayoutViewWithHook from "./components/layout/layout.view.withHook";
import LayoutUserView from "./components/layout/layout-user.view.jsx";
import LayoutDetail from "./components/layout/layout-detail.view";

//--- Home
import Dashboard from "./modules/dashboard/dashboard.view.jsx";
//--- Admin
import Login from "./modules/login/login.view.jsx";
import ForgotPassword from "./modules/forgot-password/forgot-password.view.jsx";
import ResetPassword from "./modules/reset-password/reset-password.view.jsx";

//--- Consult the community
import EmailTemplate from "./modules/email-template/email-template";
import RoleManagement from "./modules/role-management/role-management";
import ContactManagement from "./modules/contact-management/contact-management.view";
import EmailGenerated from "./modules/email-generated/email-generated.view";
import UserManagement from "./modules/user-management/user-management.view";
import CommuneManagement from "./modules/communce-management/communce-management.view";
import ProviceManagement from "./modules/province-management/provice-management.view";
import DistrictManagement from "./modules/district-management/district-management.view";
import UserLogHistory from "./modules/user-log/user-log-history.view";
import LandTypeManagement from "./modules/land-type-management/land-type-management.view";
import LandTypeDetailManagement from "./modules/land-type-detail-management/land-type-detail-management.view";
//---Log
import Log from "./modules/log/log.jsx";

//--- Slider
import Slider from "./modules/slider/slider.view.jsx";

//--- News
import News from "./modules/news/news.view.jsx";

//--- Map
import MapData from "./modules/map-data/map-data.view.jsx";
import InitMapDataView from "./modules/init-map-data/init-map-data";

//--- Records management
import RecordsManagement from "./modules/planning-announcement-process/records-management/records-management.view.jsx";
import AddRecordsManagement from "./modules/planning-announcement-process/records-management/add-records-management/add-records-management.view";
import EditRecordsManagement from "./modules/planning-announcement-process/records-management/edit-records-management/edit-records-management.view";
import EditAnnouce from "./modules/planning-announcement-process/announced/edit-announced/edit-announced.view";
import PlanningRelate from "./modules/planning-announcement-process/planning-related/planning-related.view";
import PlanningRelatedPage from "./modules/planning-announcement-process/planning-related/planning-related-page.view.jsx";
import DocumentSetting from "./modules/planning-announcement-process/document-settings/document-settings.view";
import DocumentSettingsPage from "./modules/planning-announcement-process/document-settings/document.view";
import ConsultTheCommunity from "./modules/planning-announcement-process/consult-the-community/consult-the-community.view";
import ConsultTheCommunityPage from "./modules/planning-announcement-process/consult-the-community/consult-the-community-page.view";
import LinkMapProcess from "./modules/planning-announcement-process/link-map/link-map.view";
import Investor from "./modules/investor/investor.view";
import ApprovalAgency from "./modules/approval-agency/approval-agency.view";

//--- Link
import LinkGroupManagementView from "./modules/link-group/link-group-management.view.jsx";
import ServiceLinkManagementView from "./modules/service-links/service-link-management.view";

//--- Opinion form
import OpinionForm from "./modules/opinion-form/opinion-form.view.jsx";

//--- Table Layer Structure
import TableStructure from "./modules/table-structure/table-structure.view.jsx";

//--- Access denied
import AccessDenied from "./modules/access-denied/access-denied.view.jsx";

import DocumentManagement from "./modules/document-management/document-management.view.jsx";
import MyAccount from "./modules/my-account/my-account.view.jsx";
import PlanningUnit from "./modules/planning-unit/planning-unit.view.jsx";
import HomePage from "./modules/home/home.view.jsx";
import { QHDT } from "./modules/qhdt/qhdt.view.jsx";
import Analysis from "./modules/analysis/analysis-management/analysis-management.view.jsx";
import DialogWarningExpired from "./components/dialog-warning-expired/dialog-warning-expired.view";
import LockScreen from "./components/lock-screen/lock-screen.view.jsx";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";

function App() {
  //media query
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  const reactMediaQuery = {
    isDesktopOrLaptop:isDesktopOrLaptop,
    isBigScreen:isBigScreen,
    isTabletOrMobile:isTabletOrMobile,
    isPortrait:isPortrait,
    isRetina:isRetina
  }

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
              <LayoutViewWithHook title="Dashboard">
                <Dashboard />
              </LayoutViewWithHook>
            )}
            component={Dashboard}
            path={UrlCollection.Dashboard}
          />

          <RouteComponent
            exact
            layout={() => (<HomePage reactMediaQuery={reactMediaQuery}/>)}
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
              <LayoutViewWithHook title="Phân tích quyết định">
                <Analysis />
              </LayoutViewWithHook>
            )}
            component={Analysis}
            path={UrlCollection.Analysis}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Nội dung QH hạ tầng kỹ thuật">
                <RecordsManagement isQHHTKT />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.QH_HTKT}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Thêm nội dung QH hạ tầng kĩ thuật">
                <AddRecordsManagement isQHHTKT />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.Add_QH_HTKT}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Chỉnh sửa nội dung QH hạ tầng kĩ thuật">
                <EditRecordsManagement isQHHTKT />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.Edit_QH_HTKT}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Link bản đồ">
                <LinkMapProcess isQHHTKT />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.QH_HTKT_LINK_MAP}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Xin ý kiến">
                <ConsultTheCommunity isQHHTKT />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.QH_HTKT_CONSULT}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutDetail title="Xin ý kiến">
                <ConsultTheCommunityPage isQHHTKT />
              </LayoutDetail>
            )}
            path={UrlCollection.QH_HTKT_CONSULT_ID}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Thiết lập hồ sơ">
                <DocumentSetting isQHHTKT />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.QH_HTKT_SETUP_DOCUMENT}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutDetail title="Thiết lập hồ sơ">
                <DocumentSettingsPage isQHHTKT />
              </LayoutDetail>
            )}
            path={UrlCollection.QH_HTKT_SETUP_DOCUMENT_DETAIL}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Quy hoạch liên quan">
                <PlanningRelate isQHHTKT />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.QH_HTKT_Relate}
          />

          <RouteComponent
            exact
            layout={() => (
              <LayoutDetail title="Quy hoạch liên quan">
                <PlanningRelatedPage isQHHTKT />
              </LayoutDetail>
            )}
            path={UrlCollection.QH_HTKT_RelateId}
          />
          {/* Dashboard */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Dashboard">
                <Dashboard />
              </LayoutView>
            )}
            path={UrlCollection.Dashboard}
          />

          {/* quy hoạch các cấp */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Quy hoạch các cấp">
                <RecordsManagement isQHCC />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.PlanningCC}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Thêm dự án quy hoạch các cấp">
                <AddRecordsManagement isQHCC />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.AddPlanningCC}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Chỉnh sửa dự án quy hoạch các cấp">
                <EditRecordsManagement isQHCC />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.EditPlanningCC}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Link bản đồ">
                <LinkMapProcess isQHCC />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.LinkMapPlanningCC}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Xin ý kiến">
                <ConsultTheCommunity isQHCC />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.ConsultPlanningCC}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutDetail title="Xin ý kiến">
                <ConsultTheCommunityPage isQHCC />
              </LayoutDetail>
            )}
            path={UrlCollection.ConsultPlanningCCId}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Thiết lập hồ sơ">
                <DocumentSetting isQHCC />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.DocumentPlanningCC}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutDetail title="Thiết lập hồ sơ">
                <DocumentSettingsPage isQHCC />
              </LayoutDetail>
            )}
            path={UrlCollection.DocumentPlanningCCId}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Quy hoạch liên quan">
                <PlanningRelate isQHCC />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.PlanningCCRelate}
          />

          <RouteComponent
            exact
            layout={() => (
              <LayoutDetail title="Quy hoạch liên quan">
                <PlanningRelatedPage isQHCC />
              </LayoutDetail>
            )}
            path={UrlCollection.PlanningCCRelateId}
          />
          {/* quy hoạch khác */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Quy hoạch khác">
                <RecordsManagement isOtherPlanning />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.OtherPlanning}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Quy hoạch khác">
                <RecordsManagement isOtherPlanning />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.OtherPlanning}
          />

          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Thêm dự án quy hoạch khác">
                <AddRecordsManagement isOtherPlanning />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.AddOtherPlanning}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Chỉnh sửa dự án quy hoạch khác">
                <EditRecordsManagement isOtherPlanning />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.EditOtherPlanning}
          />

          {/* Slider */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Slider">
                <Slider />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.Slider}
          />

          {/* News */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Tin tức quy hoạch tỉnh">
                <News isQHT/>
              </LayoutViewWithHook>
            )}
            path={UrlCollection.QHTNews}
          />
               <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Tin tức quy hoạch các cấp">
                <News isQHCC/>
              </LayoutViewWithHook>
            )}
            path={UrlCollection.QHCCNews}
          />
               <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Tin tức nội dung hạ tầng kĩ thuật">
                <News isQHHTKT/>
              </LayoutViewWithHook>
            )}
            path={UrlCollection.QHHTKTNews}
          />
          {/* Planning Announcement Process */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Quản lý quy hoạch">
                <RecordsManagement isQHT/>
              </LayoutViewWithHook>
            )}
            path={UrlCollection.PlanningAnnouncementProcess}
          />

          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Thêm đồ án">
                <AddRecordsManagement isQHT/>
              </LayoutViewWithHook>
            )}
            path={UrlCollection.AddPlanningAnnouncementProcess}
          />

          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Chỉnh sửa đồ án">
                <EditRecordsManagement isQHT/>
              </LayoutViewWithHook>
            )}
            path={UrlCollection.EditPlanningAnnouncementProcess}
          />

          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Chỉnh sửa công bố">
                <EditAnnouce />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.EditAnnouce}
          />

          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Quy hoạch liên quan">
                <PlanningRelate isQHT/>
              </LayoutViewWithHook>
            )}
            path={UrlCollection.PlanningRelate}
          />

          <RouteComponent
            exact
            layout={() => (
              <LayoutDetail title="Quy hoạch liên quan">
                <PlanningRelatedPage />
              </LayoutDetail>
            )}
            path={UrlCollection.PlanningRelateId}
          />

          <RouteComponent
            exact
            layout={() => (
              <LayoutDetail title="Thiết lập hồ sơ">
                <DocumentSettingsPage />
              </LayoutDetail>
            )}
            path={UrlCollection.DocumentSettingId}
          />

          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Thiết lập hồ sơ">
                <DocumentSetting isQHT/>
              </LayoutViewWithHook>
            )}
            path={UrlCollection.DocumentSetting}
          />

          <RouteComponent
            exact
            layout={() => (
              <LayoutDetail title="Xin ý kiến">
                <ConsultTheCommunityPage/>
              </LayoutDetail>
            )}
            path={UrlCollection.ConsultTheCommunityId}
          />

          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Xin ý kiến">
                <ConsultTheCommunity isQHT/>
              </LayoutViewWithHook>
            )}
            path={UrlCollection.ConsultTheCommunity}
          />

          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Link bản đồ">
                <LinkMapProcess isQHT/>
              </LayoutViewWithHook>
            )}
            path={UrlCollection.LinkMapProcess}
          />

          {/* Map */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Bản đồ">
                <MapData />
              </LayoutView>
            )}
            path={UrlCollection.MapData}
          />
          <RouteComponent
            exact
            layout={LayoutUserView}
            component={InitMapDataView}
            path={UrlCollection.CreateMapData}
          />

          {/* Email Template */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Email Template">
                <EmailTemplate />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.EmailTemplate}
          />

          {/*Email Generated */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Email Generated">
                <EmailGenerated />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.EmailGenerated}
          />

          {/* Role Management */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Role Management">
                <RoleManagement />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.RoleManagement}
          />

          {/* Contact Management */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Liên hệ">
                <ContactManagement />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.ContactManagement}
          />
          {/* Log */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Quản lý log">
                <Log />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.Log}
          />
          {/* User Management */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Quản lý người dùng">
                <UserManagement />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.UserManagement}
          />

          {/* commune Management */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Quản lý xã phường">
                <CommuneManagement />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.CommuneManagement}
          />

          {/* District Management */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Quản lý quận/huyện">
                <DistrictManagement />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.DistrictManagement}
          />

          {/* Province Management */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Quản lý tỉnh">
                <ProviceManagement />
              </LayoutViewWithHook>
            )}
            component={ProviceManagement}
            path={UrlCollection.ProvinceManagement}
          />

          {/* Link Group Management */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Danh sách nhóm">
                <LinkGroupManagementView />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.LinkGroup}
          />

          {/* Service Link Management */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Danh sách liên kết">
                <ServiceLinkManagementView />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.ServiceLink}
          />
          {/* User log */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Nhật ký người dùng">
                <UserLogHistory />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.UserLogHistory}
          />

          {/* Opinion Form */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title=" Tạo form xin ý kiến">
                <OpinionForm />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.OpinionForm}
          />

          {/* Land Type */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="Quản lý loại đất">
                <LandTypeManagement />
              </LayoutView>
            )}
            path={UrlCollection.LandType}
          />

          {/* Investor */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Chủ đầu tư">
                <Investor />
              </LayoutViewWithHook  >
            )}
            path={UrlCollection.Investor}
          />

          {/* ApprovalAgency */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Cơ quan phê duyệt">
                <ApprovalAgency />
              </LayoutViewWithHook>
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
              <LayoutViewWithHook title="Đơn vị lập quy hoạch">
                <PlanningUnit />
              </LayoutViewWithHook>
            )}
            path={UrlCollection.PlanningUnit}
          />

          {/* my account */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutViewWithHook title="Quản lý tài khoản">
                <MyAccount isTabletOrMobile={isTabletOrMobile}/>
              </LayoutViewWithHook>
            )}
            path={UrlCollection.MyAccount}
          />
          {/* Table Layer Structure */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="">
                <TableStructure />
              </LayoutView>
            )}
            path={UrlCollection.TableStructure}
          />
          {/* Access Denied */}
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="">
                <AccessDenied />
              </LayoutView>
            )}
            path={UrlCollection.AccessDenied}
          />
          <RouteComponent
            exact
            layout={() => (
              <LayoutView title="">
                <DocumentManagement />
              </LayoutView>
            )}
            component={DocumentManagement}
            path={UrlCollection.DocumentManagement}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
