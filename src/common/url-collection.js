import * as ApiConfig from "../api/api-config";

export const UrlCollection = {
  Home: "/ignore",
  Dashboard: "/qhdt/dashboard",
  Slider: "/he-thong/bai-viet-trang-chu",
  AddPlanningAnnouncementProcess: "/qhdt/quy-trinh-cong-bo-quy-hoach/them-moi",
  EditPlanningAnnouncementProcess: `/qhdt/quy-trinh-cong-bo-quy-hoach/chinh-sua/:id`,
  EditAnnouce: `/qhdt/quy-trinh-cong-bo-quy-hoach/cong-bo/:id`,
  InitMap: `/qhdt/quy-trinh-cong-bo-quy-hoach/map/:id`,
  
  QHDT: '/qhdt',
  PlanningAnnouncementProcess: '/qhdt/quy-trinh-cong-bo-quy-hoach',
  LinkMapProcess: '/qhdt/quy-trinh-cong-bo-quy-hoach/link-ban-do',
  ConsultTheCommunity: '/qhdt/quy-trinh-cong-bo-quy-hoach/xin-y-kien',
  ConsultTheCommunityId: '/qhdt/quy-trinh-cong-bo-quy-hoach/xin-y-kien/:id',
  PlanningRelate: '/qhdt/quy-trinh-cong-bo-quy-hoach/quy-hoach-lien-quan',
  PlanningRelateId: '/qhdt/quy-trinh-cong-bo-quy-hoach/quy-hoach-lien-quan/:id',
  DocumentSetting: '/qhdt/quy-trinh-cong-bo-quy-hoach/thiet-lap-ho-so',
  DocumentSettingId: '/qhdt/quy-trinh-cong-bo-quy-hoach/thiet-lap-ho-so/:id',

  //Planning Types
  QHTPlanningTypes: '/qhdt/quy-trinh-cong-bo-quy-hoach/chuyen-muc',
  QHCCPlanningTypes: '/qhdt/qh-cac-cap/chuyen-muc',
  QHHTKTPlanningTypes: '/qhdt/noi-dung-ha-tang-ky-thuat/chuyen-muc',

  //News
  News: '/qhdt/tin-tuc',
  QHTNews: '/qhdt/quy-trinh-cong-bo-quy-hoach/tin-tuc',
  QHCCNews: '/qhdt/qh-cac-cap/tin-tuc',
  QHHTKTNews: '/qhdt/noi-dung-ha-tang-ky-thuat/tin-tuc',
  
  Analysis: '/ptqd',
  StatisticsOfObjects: '/ptqd/phan-tich-giua-cac-doi-tuong-lien-quan',
  SearchObjectsOnMap: '/ptqd/tim-kiem-tren-ban-do',

  SyncUpData:'/qhdt/dong-bo-du-lieu-len-he-thong',
  SyncDownData:'/qhdt/dong-bo-du-lieu-tu-he-thong',
  SyncSetting_PlanningType:'/qhdt/cai-dat-nguyen-tac-dong-bo-chuyen-muc',
  SyncSetting_District:'/qhdt/cai-dat-nguyen-tac-dong-bo-quan-huyen',
  PAHT: ApiConfig.paht_url,

  // Kĩ thuật hạ tầng
  QH_HTKT: '/qhdt/noi-dung-ha-tang-ky-thuat',
  Add_QH_HTKT: '/qhdt/noi-dung-ha-tang-ky-thuat/them-moi',
  Edit_QH_HTKT: '/qhdt/noi-dung-ha-tang-ky-thuat/chinh-sua/:id',
  QH_HTKT_LINK_MAP: '/qhdt/noi-dung-ha-tang-ky-thuat/link-ban-do',
  QH_HTKT_CONSULT: '/qhdt/noi-dung-ha-tang-ky-thuat/xin-y-kien',
  QH_HTKT_CONSULT_ID: '/qhdt/noi-dung-ha-tang-ky-thuat/xin-y-kien/:id',
  QH_HTKT_SETUP_DOCUMENT: '/qhdt/noi-dung-ha-tang-ky-thuat/thiet-lap-ho-so',
  QH_HTKT_SETUP_DOCUMENT_DETAIL: '/qhdt/noi-dung-ha-tang-ky-thuat/thiet-lap-ho-so/:id',
  QH_HTKT_Relate: '/qhdt/noi-dung-ha-tang-ky-thuat/quy-hoach-lien-quan',
  QH_HTKT_RelateId: '/qhdt/noi-dung-ha-tang-ky-thuat/quy-hoach-lien-quan/:id',
  QH_HTKT_Add: "/qhdt/noi-dung-ha-tang-ky-thuat/them-moi",
  QH_HTKT_Edit: `/qhdt/noi-dung-ha-tang-ky-thuat/chinh-sua/:id`,

  //quy hoạch khác
  OtherPlanning: '/qhdt/qh-khac',
  AddOtherPlanning: '/qhdt/qh-khac/them-moi',
  EditOtherPlanning: '/qhdt/qh-khac/chinh-sua/:id',
  //quy hoạch các cấp
  PlanningCC: '/qhdt/qh-cac-cap',
  AddPlanningCC: '/qhdt/qh-cac-cap/them-moi',
  EditPlanningCC: '/qhdt/qh-cac-cap/chinh-sua/:id',
  LinkMapPlanningCC: '/qhdt/qh-cac-cap/link-ban-do',
  ConsultPlanningCC: '/qhdt/qh-cac-cap/xin-y-kien',
  ConsultPlanningCCId: '/qhdt/qh-cac-cap/xin-y-kien/:id',
  PlanningCCRelate: '/qhdt/qh-cac-cap/quy-hoach-lien-quan',
  PlanningCCRelateId: '/qhdt/qh-cac-cap/quy-hoach-lien-quan/:id',
  DocumentPlanningCC: '/qhdt/qh-cac-cap/thiet-lap-ho-so',
  DocumentPlanningCCId: '/qhdt/qh-cac-cap/thiet-lap-ho-so/:id',

  EmailTemplate: '/he-thong/email-template',
  RoleManagement: '/he-thong/role-management',
  ContactManagement: '/he-thong/contact-management',
  EmailGenerated: '/he-thong/email-generated',
  UserManagement: '/he-thong/quan-ly-nguoi-dung',
  CommuneManagement: '/he-thong/quan-ly-xa-phuong',
  DistrictManagement: '/he-thong/quan-ly-quan-huyen',
  ProvinceManagement: '/he-thong/quan-ly-thanh-pho',
  LinkGroup: '/he-thong/danh-sach-nhom',
  ServiceLink: '/he-thong/danh-sach-lien-ket',
  UserLogHistory: '/he-thong/nhat-ky-nguoi-dung',
  LandType: '/quan-ly-loai-dat',
  LandTypeDetail: '/quan-ly-chi-tiet-loai-dat',

  CategoryParent: '/category-parent',
  DocumentManagement: '/document-management',
  Log: '/he-thong/log',
  //--- Account
  Login: '/dang-nhap',
  Register: '/dang-ky',
  ForgotPassword: '/quen-mat-khau',
  ConfirmCode: '/xac-nhan',
  ResetPassword: '/dat-lai-mat-khau',
  MapData: '/ban-do',
  CreateMapData: '/thiet-dat-thong-so-ban-do/:mapKey',
  AccessDenied: '/403',
  OpinionForm: '/he-thong/tao-form-y-kien',
  MyAccount: '/quan-ly-tai-khoan',
  //--- Table structure
  TableStructure: '/sua-cau-truc-bang',
  PlanningUnit: "/he-thong/don-vi-lap-quy-hoach",
  Investor: "/he-thong/chu-dau-tu",
  ApprovalAgency: "/he-thong/co-quan-phe-duyet",

};
