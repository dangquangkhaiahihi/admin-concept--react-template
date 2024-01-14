import { combineReducers } from "redux";

import AppReducer from "../core/app.store";
import OpenLayerReducer from "./store/openlayer/openlayer.store";
import InitMapReducer from "./store/init-map/init-map.store";
import LoadingReducer from "./store/loading/loading.store";
import DocumentRepositoryReducer from "./store/document-repository/document-repository.store";
import DocumentManagementReducer from "./store/document/document-management-redux.store";
import InitDocumentReducer from './store/document/document-management.store';

import ClientSettingReducer from './store/client_setting/client_setting.store'

export default combineReducers({
  app: AppReducer,
  openLayer: OpenLayerReducer,
  initMap: InitMapReducer,
  loadingState: LoadingReducer,
  documentRepository: DocumentRepositoryReducer,
  documentManagement: DocumentManagementReducer,
    InitDocument: InitDocumentReducer,
  clientSetting: ClientSettingReducer,
});
