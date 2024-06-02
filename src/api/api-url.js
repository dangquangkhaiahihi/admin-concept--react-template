export const ApiUrl = {
  //--- Account
  Login: "api/admin/Account/Login",
  Register: "api/Account/Register",
  ForgotPassword: "api/Account/ForgotPassword",
  ResetPassword: "​api​/Account​/ResetPassword",
  GetUserAccountDetail: "api/Account/GetUserAccountDetail",
  UpdateUserAccountDetail: "api/Account/UpdateUserAccount",
  UpdateUserAccountPassword: "/api/Account/ChangePassword",
  GetScreenAllow: "api/admin/Permission/GetScreenAlow",

  //--- Email Generated
  GetListEmailGenerated: "api/admin/EmailGenerated/GetListEmailGenerated",
  GetDetailEmailGenerated: "api/admin/EmailGenerated/GetDetailEmailGenerated",

  //--- Email Template
  GetListEmailTemplates: "api/admin/EmailTemplate/GetListEmailTemplates",
  GetDetailEmailTemplate: "api/admin/EmailTemplate/GetDetailEmailTemplate",
  CreateEmailTemplate: "api/admin/EmailTemplate/CreateEmailTemplate",
  UpdateEmailTemplate: "api/admin/EmailTemplate/UpdateEmailTemplate",
  DeleteEmailTemplate: "api/admin/EmailTemplate/DeleteEmailTemplate",

  //--- Contact Management
  GetListContactManagement: "api/admin/EmailGenerated/GetListContactToAdmin",
  GetContactDetail: "api/admin/EmailGenerated/GetDetailContactToAdmin",
  ReplyUserContactByEmail: "api/admin/EmailGenerated/ReplyUserContactByEmail",
  GetDetailEmailTemplate: "api/admin/EmailTemplate/GetDetailEmailTemplate",

  //--- Role Management
  GetListRoleManagement: "api/admin/Role/GetListRole",
  GetDetailRoleManagement: "api/admin/Role/GetDetailRole",
  CreateRoleManagement: "api/admin/Role/CreateRole",
  UpdateRoleManagement: "api/admin/Role/UpdateRole",
  DeleteRoleManagement: "api/admin/Role/DeleteRole",
  GetRoleLookup: "api/admin/Role/GetRoleLookup",

  //--- Map
  CreateMap: "api/admin/Map/create-map",
  GetMapById: "api/admin/Map/get-map-by-id",
  GetMapAnalysisById: "api/admin/Map/get-map-analysis-by-id",
  GetAllBaseMapSetting: "api/admin/BaseMapSetting/get-all",
  GetPgSchema: "api/admin/PgTable/get-pg-schema",
  GetPageByTable: "api/admin/PgTable/get-pg-table",
  UpdateMap: "api/admin/Map/update-map",
  //GetPgTable: "api/admin/PgTable/get-pg-table",
   GetPgTable: "/api/admin/DisplayDictionary/LookUpByTableName",
  DeleteMap: "api/admin/Map/delete-map",
  ActiveMapById: "api/admin/Map/active-map-by-id",
  DeactiveMapById: "api/admin/Map/deactive-map-by-id",
  InitMap: "api/admin/Map/init-map",
  
  //BaseMap
  CreateBaseMap: "api/admin/BaseMap/Create",
  UpdateBaseMap: "api/admin/BaseMap/Update",
  DeleteBaseMap: "api/admin/BaseMap/Delete/",
  GetDetailBaseMap: "api/admin/BaseMap/GetDetail",

  //MapLayer
  CreateLayer: "api/admin/Layer/Create",
  UpdateLayer: "api/admin/Layer/Update",
  DeleteLayer: "api/admin/Layer/Delete",
  UpdateLayerLevel: "/api/admin/Layer/UpdateLevel",
  GetDetailLayer: "api/admin/Layer/GetDetail",
  AutoCuPlanning: "api/admin/Planning/AutoCreateOrUpdatePlanning",
  CreateBaseOnExistLayer: "api/admin/Layer/CreateBaseOnExistLayer",

  //LayerCategory
  CreateLayerCategory: "api/admin/LayerCategory/Create",
  UpdateLayerCategory: "api/admin/LayerCategory/Update",
  DeleteLayerCategory: "api/admin/LayerCategory/Delete",
  UpdateLayerCategoryLevel: "/api/admin/LayerCategory/UpdateLevel",
  GetDetailLayerCategory: "api/admin/LayerCategory/GetDetail",
  GetLookupLayerCategoryType: "/api/admin/LayerCategoryType/GetListAll",

  //--- Planning
  GetListPlanning: "api/admin/Planning/GetListPlanning",
  GetLookUpPlanning: "api/admin/Planning/GetLookUpPlanning",
  GetLookUpPlanningStatus: "api/admin/Planning/GetLookUpPlanningStatus",
  GetLookUpPlanningLevel: "api/admin/Planning/GetLookUpPlanningLevel",
  GetLookUpPlanningType: "api/admin/Planning/GetLookUpPlanningType",
  GetLookUpDocumentType: "api/admin/Planning/GetLookUpDocumentType",
  GetDetailPlaning: "api/admin/Planning/GetDetailPlaning",
  CreatePlanning: "api/admin/Planning/CreatePlanning",
  UpdatePlanning: "api/admin/Planning/UpdatePlanning",
  DeletePlanning: "api/admin/Planning/DeletePlanning",
  LockPlanning: "api/admin/Planning/Lock",
  UnLockPlanning: "api/admin/Planning/UnLock",
  PlanningRelationshipType:
    "api/admin/Planning/get-all-planning-relationship-type",
  PlanningRelationshipTypeById:
    "api/admin/Planning/get-all-planning-relationship-by-planning-id",
  PlanningApprovedById:
    "api/admin/Planning/get-look-up-approved-planning-by-id",
  PutPlanningRelationship:
    "api/admin/Planning/update-multiple-planning-relationship",
  GetAllBoundaries: "api/admin/Planning/get-all-boundaries",
  CheckExistedPlanning: "api/admin/Planning/CheckExistedPlanning",
  GetLookupLayerByPlanningId:
    "api/admin/Planning/get-lookup-layer-by-planning-id",

  //--- Consultant Community
  GetListConsultCommunity:
    "api/admin/ConsultantCommunity/GetListConsultCommunity",
  GetDetailConsultCommunity:
    "api/admin/ConsultantCommunity/GetDetailConsultCommunity",
  CreateConsultCommunity:
    "api/admin/ConsultantCommunity/CreateConsultCommunity",
  UpdateConsultCommunity:
    "api/admin/ConsultantCommunity/UpdateConsultCommunity",
  DeleteConsultCommunity:
    "api/admin/ConsultantCommunity/DeleteConsultCommunity",
  GetConsultCommunityStatusLookup:
    "api/admin/ConsultantCommunity/GetConsultCommunityStatusLookup",
  GetConsultCommunityByPlanning:
    "api/admin/ConsultantCommunity/GetConsultCommunityByPlanning",
  ExportConsultantList: "api/ExportData/ExportConsultantList",

  //--- Statement
  GetListStatement: "api/admin/Statement/GetListStatement",
  // GetDetailStatement: "​api​/admin​/Statement​/GetStatementByPlanning",
  CreateStatement: "api/admin/Statement/CreateStatement",
  UpdateStatement: "api/admin/Statement/UpdateStatement",
  DeleteStatement: "api/admin/Statement/DeleteStatement",
  GetStatementStatusLookup: "api/admin/Statement/GetStatementStatusLookup",
  GetListServiceLink: "api/admin/Statement/GetListServiceLink",
  SearchStatement: "api/admin/Statement/search-statement-by",
  GetStatementReport: "api/admin/Statement/GetStatementReport",

  // Home page
  GetListHomePage: "api/admin/HomePage/GetListHomePage",
  GetDetailHomePage: "api/admin/HomePage/GetDetailHomePage",
  CreateHomePage: "api/admin/HomePage/CreateHomePage",
  UpdateHomePage: "api/admin/HomePage/UpdateHomePage",
  DeleteHomePage: "api/admin/HomePage/DeleteHomePage",
  DeleteAvatar: "api/admin/HomePage/DeleteAvatar",

  // User Management
  GetListUserManagement: "api/admin/User/GetUserManagement",
  GetDetailUserManagement: "api/admin/User/GetUserDetail",
  CreateUserManagement: "api/admin/User/CreateUser",
  UpdateUserManagement: "api/admin/User/UpdateUser",
  DeleteUserManagement: "api/admin/User/DeleteUser",

  ActiveUserManagement: "api/admin/User/ActiveUser",
  ResetPasswordUserManagement: "api/admin/User/ResetPassword",
  GetRoleLookupUserManagement: "api/admin/Role/GetRoleLookup",
  ActiveUser: "api/admin/User/ActiveUser",
  DeActiveUser: "api/admin/User/DeActiveUser",
  CreateWithMultiRoles: "api/admin/User/CreateUserMutiRoles",
  UpdateWithMultiRoles: "api/admin/User/UpdateUserMutiRoles",

  //ApprovalAgencyLevel
  ApprovalAgencyLevel:
    "api/admin/ApprovalAgencyLevel/get-approval-agency-level",
  GetLookupDistrict: "api/admin/Administrative/GetLookupDistrict",

  //Document
  GetAllDocumentByPlanning: "api/admin/Document/GetAllDocumentByParentId",
  CreateFolder: "api/admin/Document/CreateDocumentFolder",
  ReNameDocument: "api/admin/Document/RenameDocument",
  CreateFile: "api/admin/Document/UploadDocument",
  RemoveDocument: "api/admin/Document/DeleteDocument",
  MoveDocument: "api/admin/Document/MoveDocument",
  SearchDocument: "api/admin/Document/SearchDocument",
  SetDocumentStatus: "api/admin/Document/SetDocumentStatus",
  DownloadDocument: "api/admin/Document/DownloadDocument",
  GetAllFolder: "api/admin/Document/ListAllFolder",
  GetDocumentByFolder: "api/admin/Document/GetDocumentByFolder",
  GetStatisticByPlanningId : "api/admin/Document/GetStatisticByPlanningId",
  
  // CommuneManagement
  GetListCommune: "api/admin/Administrative/GetListCommune",
  GetDetailCommune: "api/admin/Administrative/GetDetailCommune",
  CreateCommune: "api/admin/Administrative/CreateCommune",
  UpdateCommune: "api/admin/Administrative/UpdateCommune",
  DeleteCommune: "api/admin/Administrative/DeleteCommune",
  GetDistrictByProvinceId: "api/admin/Administrative/GetLookupDistrict",
  GetLookupCommune: "api/admin/Administrative/GetLookupCommune",
  CreateCommunePaht: 'api/admin/Commune/Create',
  UpdateCommunePaht: 'api/admin/Commune/Update',
  DeleteCommunePaht: 'api/admin/Commune/Delete',

  // DistrictManagement
  GetListDistrict: "api/admin/Administrative/GetListDistrict",
  GetDetailDistrict: "api/admin/Administrative/GetDetailDistrict",
  GetLookupDistrict: "api/admin/Administrative/GetLookupDistrict",
  CreateDistrict: "api/admin/Administrative/CreateDistrict",
  UpdateDistrict: "api/admin/Administrative/UpdateDistrict",
  DeleteDistrict: "api/admin/Administrative/DeleteDistrict",
  CreateDistrictPaht: 'api/admin/District/Create',
  UpdateDistrictPaht: 'api/admin/District/Update',
  DeleteDistrictPaht: 'api/admin/District/Delete',

  // Planning Type Management
  
  GetListPlanningType: "/api/admin/PlanningType/GetListAll",
  CreatePlanningType: "/api/admin/PlanningType/Create",
  UpdatePlanningType: "/api/admin/PlanningType/Update",
  DeletePlanningType: "/api/admin/PlanningType/Delete",
  GetDetailPlanningType: "/api/admin/PlanningType/GetDetail",

  //Year Statement
  GetYearStatement: '/api/cms/Planning/get-all-year-statment',

  GetLookUpObjectKind: '/api/cms/Common/GetLookUpObjectKind',
  // ProvinceManagement
  GetListProvince: "api/admin/Administrative/GetListProvince",
  GetDetailProvince: "api/admin/Administrative/GetDetailProvince",
  CreateProvince: "api/admin/Administrative/CreateProvince",
  UpdateProvince: "api/admin/Administrative/UpdateProvince",
  DeleteProvince: "api/admin/Administrative/DeleteProvince",
  GetLookupProvince: "api/admin/Administrative/GetLookupProvince",
  CreateProvincePaht: 'api/admin/Province/Create',
  UpdateProvincePaht: 'api/admin/Province/Update',
  DeleteProvincePaht: 'api/admin/Province/Delete',

  //Link Group Management
  GetListLinkGroup: "api/admin/Administrative/GetListLinkGroup",
  GetDetailLinkGroup: "api/admin/Administrative/GetDetailLinkGroup",
  CreateLinkGroup: "api/admin/Administrative/CreateLinkGroup",
  UpdateLinkGroup: "api/admin/Administrative/UpdateLinkGroup",
  DeleteLinkGroup: "api/admin/Administrative/DeleteLinkGroup",

  //Service Link Management
  GetListServiceLink: "api/admin/Administrative/GetListLinkService",
  GetDetailServiceLink: "api/admin/Administrative/GetDetailLinkService",
  CreateServiceLink: "api/admin/Administrative/CreateLinkService",
  UpdateServiceLink: "api/admin/Administrative/UpdateLinkService",
  DeleteServiceLink: "api/admin/Administrative/DeleteLinkService",
  GetLookupLinkGroup: "api/admin/Administrative/GetLookupLinkGroup",

  //Userlog
  GetAllLogHistory: "api/admin/LogHistory/GetAllLogHistory",

  //Land Type
  GetListLandType: "api/admin/Land/GetListLandType",
  LookupLandType: "api/admin/Land/LookupLandType",
  GetLandTypeById: "api/admin/Land/GetLandTypeById",
  CreateLandType: "api/admin/Land/CreateLandType",
  UpdateLandType: "api/admin/Land/UpdateLandType",
  DeleteLandType: "api/admin/Land/DeleteLandType",

  //Land Type Detail
  GetListLandTypeDetail: "api/admin/Land/GetListLandTypeDetail",
  GetLandTypeDetailById: "api/admin/Land/GetLandTypeDetailById",
  CreateLandTypeDetail: "api/admin/Land/CreateLandTypeDetail",
  UpdateLandTypeDetail: "api/admin/Land/UpdateLandTypeDetail",
  DeleteLandTypeDetail: "api/admin/Land/DeleteLandTypeDetail",

  //Opinion Form
  CreateFormTemplate: "api/admin/ConsultantCommunity/CreateFormTemplate",
  UpdateFormTemplate: "api/admin/ConsultantCommunity/UpdateFormTemplate",
  GetListFormTemplate: "api/admin/ConsultantCommunity/GetListFormTemplate",
  GetDetailFormTemplate: "api/admin/ConsultantCommunity/GetDetailFormTemplate",
  DeleteFormTemplate: "api/admin/ConsultantCommunity/DeleteFormTemplate",
  GetLookupFormExample: "api/admin/ConsultantCommunity/GetLookupFormExample",

  GetDetailFeedback: "api/admin/ConsultantCommunityAdmin/GetDetailFeedback",
  SaveReply: "api/admin/ConsultantCommunityAdmin/SaveReply",

  //utils-shape-file
  Shape_File_Step_1: "api/admin/Utils/step-1-import-and-unzip-file",
  Shape_File_Step_2: "api/admin/Utils/step-2-import-shape-file-to-postgis",
  Shape_File_Step_3: "api/admin/Utils/step-3-created-sld-and-import-to-postgis",
  Shape_File_Step_4: "api/admin/Utils/step-4-publish",
  // Shape_File_Publish_Finish: "api/admin/Utils/publish-again",

  //utils-tiff-file
  Import_Tiff_File: "api/admin/Utils/import-tif",

  //News
  News_Create: "api/admin/News/Create",
  News_Update: "api/admin/News/Update",
  News_Delete: "api/admin/News/Delete",
  News_Restore: "api/admin/News/Restore/{id}",
  News_EmptyTrash: "api/admin/News/EmptyTrash",
  News_ChangeActiveStatus: "api/admin/News/ChangeActiveStatus",
  News_ChangeHotStatus: "api/admin/News/ChangeHotStatus",
  News_ChangeFeatureStatus: "api/admin/News/ChangeFeatureStatus",
  News_GetListAll: "api/admin/News/GetListAll",
  News_GetListByCat: "api/admin/News/GetListByCat",
  News_GetListHot: "api/admin/News/GetListHot",
  News_GetListByStatus: "api/admin/News/GetListByStatus",
  News_GetDetail: "api/admin/News/GetDetail/{id}",

  DownloadFile: "api/cms/Planning/DownloadFileBinary",

  //--- Document Repository
  DocumentRepositoryCreateFolder:
    "api/admin/DocumentUpload/CreateDocumentFolder",
  DocumentRepositoryUploadDocument: "api/admin/DocumentUpload/UploadDocument",
  DocumentRepositoryDownloadDocument:
    "api/admin/DocumentUpload/DownloadDocument",
  DocumentRepositoryDeleteDocument: "api/admin/DocumentUpload/DeleteDocument",
  DocumentRepositoryGetAllDocumentByParentId:
    "api/admin/DocumentUpload/GetAllDocumentByParentId",
  DocumentRepositoryMoveDocument: "api/admin/DocumentUpload/MoveDocument",
  DocumentRepositorySearchDocument: "api/admin/DocumentUpload/SearchDocument",
  DocumentRepositoryRenameDocument: "api/admin/DocumentUpload/RenameDocument",
  DocumentRepositoryGetParentDocumentById:
    "api/admin/DocumentUpload/GetParentDocumentById",
  UrlUploadFromEditor: "api/admin/DocumentUpload/UploadImage",

  // Security Matrix
  GetSecurityMatrixDetail: "api/admin/Permission/GetSecurityMatrixDetail",
  GetActionLookup: "api/admin/Permission/GetActionLookup",
  GetScreenLookup: "api/admin/Permission/GetScreenLookup",
  UpdateSecurityMatrix: "api/admin/Permission/UpdateSecurityMatrix",

  //Introduce
  Introduce_Create: "api/admin/Introduce/Create",
  Introduce_Update: "api/admin/Introduce/Update",
  Introduce_GetListAll: "api/admin/Introduce/GetListAll",
  Introduce_GetDetail: "api/admin/Introduce/GetDetail/{id}",

  GetDefaultCordinate: "api/cms/Administrative/GetDefaultCordinate",
  UpdateDefaultCordinate: "api/admin/Administrative/UpdateDefaultCordinate",
  GetClientSetting: "api/cms/Administrative/GetClientSetting",
  //Log
  Log_GetListAll: "/api/admin/Log/GetListAll",
  Log_Delete: (id) => `/api/admin/Log/Delete?${id}`,
  Log_Detail: (id) => `/api/admin/Log/GetById?id=${id}`,

  //PlanningUnit
  PlanningUnitGetLookUp: "api/admin/PlanningUnit/GetLookUp",
  PlanningUnitGetListAll: "api/admin/PlanningUnit/GetListAll",
  PlanningUnitGetDetail: "api/admin/PlanningUnit/GetDetail/{id}",
  PlanningUnitUpdate: "api/admin/PlanningUnit/Update",
  PlanningUnitDelete: "api/admin/PlanningUnit/Delete/{id}",
  PlanningUnitCreate: "api/admin/PlanningUnit/Create",
  PlanningUnitGetLookUp: "api/admin/PlanningUnit/GetLookup",

  //Investor
  InvestorGetLookUp: "api/admin/Investor/GetLookUp",
  InvestorGetListAll: "api/admin/Investor/GetListAll",
  InvestorGetDetail: "api/admin/Investor/GetDetail/{id}",
  InvestorUpdate: "api/admin/Investor/Update",
  InvestorDelete: "api/admin/Investor/Delete/{id}",
  InvestorCreate: "api/admin/Investor/Create",
  InvestorGetLookup: "api/admin/Investor/GetLookup",

  //Approval agency
  ApprovalAgencyGetLookUp: "api/admin/ApprovalAgency/GetLookUp",
  ApprovalAgencyGetListAll: "api/admin/ApprovalAgency/GetListAll",
  ApprovalAgencyGetDetail: "api/admin/ApprovalAgency/GetDetail/{id}",
  ApprovalAgencyUpdate: "api/admin/ApprovalAgency/Update",
  ApprovalAgencyDelete: "api/admin/ApprovalAgency/Delete/{id}",
  ApprovalAgencyCreate: "api/admin/ApprovalAgency/Create",
  ApprovalAgencyGetLookup: "api/admin/ApprovalAgency/GetLookup",
  ApprovalAgencyGetLookupWithId: "api/admin/ApprovalAgency/GetLookup?level={id}",

  // Dashboard
  GetPlanningConsultantingStatistics: "api/admin/Dashboard/GetPlanningConsultantingStatistics",
  GetPlanningStatistics: "/api/admin/Dashboard/GetPlanningStatistics",
  GetPlanningByUnitStatistics: "/api/admin/Dashboard/GetPlanningByUnitStatistics",
  GetPlanningCoverageStatistics: "/api/admin/Dashboard/PlanningCoverageStatistics",
  GetAreaOfLandStatistics: "/api/admin/Dashboard/GetAreaOfLandStatistics",
  GetPlanningByTypeStatistics: "/api/admin/Dashboard/GetPlanningByTypeStatistics",
   
  // ReflectionProcessingUnit
  GetLookUpReflectionProcessingUnit: "/api/admin/ReflectionProcessingUnit/GetLookup",

  //GeoGIS
  UpdateGeogisColumnData: "/api/admin/GeoGIS/UpdateGeogisColumnData",
  
  //getDetailAdmin
  GetDetailAcc: "api/account/GetUserAccountDetail",
    //Analysis
    AnalysisGetListAll: "api/admin/Analysis/GetListAll",
    AnalysisGetDetail: "api/admin/Analysis/GetDetail/{id}",
    AnalysisUpdate: "api/admin/Analysis/Update",
    AnalysisDelete: "api/admin/Analysis/Delete/{id}",
    AnalysisCreate: "api/admin/Analysis/Create",
    
    //Object Geogises
    GetStatisticsOfObjects: "/api/admin/Dashboard/GetStatisticsOfObjects",
    GetObjectGeogisOnMap: '/api/admin/Dashboard/GetObjectGeogis',

    //AnalysisNote
    AnalysisNoteGetListAll: "api/admin/AnalysisNote/GetListAll",
    AnalysisNoteGetDetail: "api/admin/AnalysisNote/GetDetail/{id}",
    AnalysisNoteUpdate: "api/admin/AnalysisNote/Update",
    AnalysisNoteDelete: "api/admin/AnalysisNote/Delete/{id}",
    AnalysisNoteCreate: "api/admin/AnalysisNote/Create",
    //AnalysisSub
    AnalysisSubListLayer: "api/admin/AnalysisSubmap/get-list-layer-submap-by-id",
    AnalysisSubListAll: "api/admin/AnalysisSubmap/GetListAll",
    AnalysisSubDetail: "api/admin/AnalysisSubmap/GetDetail/{id}",
    AnalysisSubUpdate: "api/admin/AnalysisSubmap/Update",
    AnalysisSubDelete: "api/admin/AnalysisSubmap/Delete",
    AnalysisSubCreate: "api/admin/AnalysisSubmap/Create",
    //PlanningSync
    PlanningSyncCheckLogin: "api/admin/PlanningSync/CheckLogin",
    PlanningSync: "api/admin/PlanningSync/Sync",
    PlanningSyncUpdate: "api/admin/PlanningSync/Update",
    PlanningSyncMany: "api/admin/PlanningSync/SyncMany",
    PlanningSyncGetDetail: "api/admin/PlanningSync/GetDetail/{id}",
    GetListPlanningSyncUp: "api/admin/PlanningSync/GetListPlanningSyncUp",
    StatisticPlanningSyncUp : "api/admin/PlanningSync/StatisticPlanningSyncUp",
    GetListPlanningSyncDown: "api/admin/PlanningCrawl/GetListPlanningSyncDown",
    //PlanningCrawl
    PlanningCrawlData: "api/admin/PlanningCrawl/CrawlData",
    PlanningSyncDown: "api/admin/PlanningCrawl/Sync",
    PlanningSyncRemoveConection: "api/admin/PlanningSync/RemoveConection",


    // CUSTOM =================================
    // Plan
    GetListPlanManagement: "api/admin/Plan/GetAll", // form
    GetDetailPlanManagement: "api/admin/Plan/GetDetail/{id}",
    CreatePlanManagement: "api/admin/Plan/Create", //json
    UpdatePlanManagement:"api/admin/Plan/Update", //json
    DeletePlanManagement: "api/admin/Plan/Delete/{id}",

    // Client
    GetListClientManagement: "api/admin/Client/GetAll", // form
    GetDetailClientManagement: "api/admin/Client/GetDetail/{id}",
    CreateClientManagement: "api/admin/Client/Create", //json
    UpdateClientManagement:"api/admin/Client/Update", //json
    DeleteClientManagement: "api/admin/Client/Delete/{id}",
    GetLookupClient: 'api/admin/Client/GetLookup',

    // Client Note
    GetListClientNoteManagement: "api/admin/ClientNote/GetAll", // form
    GetDetailClientNoteManagement: "api/admin/ClientNote/GetDetail/{id}",
    CreateClientNoteManagement: "api/admin/ClientNote/Create", //json
    UpdateClientNoteManagement:"api/admin/ClientNote/Update", //json
    DeleteClientNoteManagement: "api/admin/ClientNote/Delete/{id}",

    // Order
    GetListOrderManagement: "api/admin/Order/GetAll", // form
    GetDetailOrderManagement: "api/admin/Order/GetDetail/{id}",
    CreateOrderManagement: "api/admin/Order/Create", //json
    UpdateOrderManagement:"api/admin/Order/Update", //json
    DeleteOrderManagement: "api/admin/Order/Delete/{id}",
    GetLookupOrder: 'api/admin/Order/GetLookup',

    // Deposit
    GetListDepositManagement: "api/admin/DepositHistory/GetAll", // form
    GetDetailDepositManagement: "api/admin/DepositHistory/GetDetail/{id}",
    CreateDepositManagement: "api/admin/DepositHistory/Create", //json
    UpdateDepositManagement:"api/admin/DepositHistory/Update", //json
    DeleteDepositManagement: "api/admin/DepositHistory/Delete/{id}",

    // Group
    GetListGroupManagement: "api/admin/Group/GetAll", // form
    GetDetailGroupManagement: "api/admin/Group/GetDetail/{id}",
    CreateGroupManagement: "api/admin/Group/Create", //json
    UpdateGroupManagement:"api/admin/Group/Update", //json
    DeleteGroupManagement: "api/admin/Group/Delete/{id}",
    GetLookupGroup: "api/admin/Group/GetLookup",
    // Get Menu
    GetMenu: '/api/Account/GetMenu'
};
