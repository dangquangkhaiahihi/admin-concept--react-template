import { Map } from "immutable";

const APP_LOADING = "APP_LOADING";
const APP_SYNC_LOADING = "APP_SYNC_LOADING";
const COLLAPSE_SIDEBAR = "COLLAPSE_SIDEBAR";
const EXPAND_SIDEBAR = "EXPAND_SIDEBAR";

export const onLoading = (isLoading) => ({ type: APP_LOADING, isLoading });
export const onSyncLoading = (isSyncLoading) => ({ type: APP_SYNC_LOADING, isSyncLoading });

export const expandSidebar = () => ({ type: EXPAND_SIDEBAR });
export const collapse = () => ({ type: COLLAPSE_SIDEBAR });

export const ShowLoading = (isLoading) => {
  return (dispatch) => {
    dispatch(onLoading(isLoading));
  };
};

export const ShowSyncLoading = (isSyncLoading) => {
  return (dispatch) => {
    dispatch(onSyncLoading(isSyncLoading));
  };
};

export const ExpandSidebar = () => {
  return (dispatch) => {
    dispatch(expandSidebar());
  };
};

export const CollapseSidebar = () => {
  return (dispatch) => {
    dispatch(collapse());
  };
};

export const initialState = Map({
  loading: false,
  syncLoading: false,
}).toJS();

export default function AppReducer(state = initialState, action) {
  switch (action.type) {
    case APP_LOADING:
      return {
        ...state,
        loading: action.isLoading,
      };
    case APP_SYNC_LOADING:
      return {
        ...state,
        syncLoading: action.isSyncLoading,
      };
    case COLLAPSE_SIDEBAR:
      return {
        ...state,
        isCollapsed: true,
      };
    case EXPAND_SIDEBAR:
      return {
        ...state,
        isCollapsed: false,
      };
    default:
      return { ...state };
  }
}
