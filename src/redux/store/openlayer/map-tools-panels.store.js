const DISPLAYMAPTOOLSPANEL = "MAPTOOLPANEL/DISPLAYPANEL";
const DISPLAYINFOMATIONPOPUP = "MAPTOOLPANEL/DISPLAYINFORMATIONSEARCH";

const actionDisplayMaptoolPanel = (data) => ({ type: DISPLAYMAPTOOLSPANEL, data: data })
const actionDisplayInfomationSearch = (data) => ({ type: DISPLAYINFOMATIONPOPUP, data: data })

export const SetDisplayMaptoolPanel = (data) => {
    return (dispatch) => {
        dispatch(actionDisplayMaptoolPanel(data))
    }
}

export const SetDisplayInfomationPopup = (data) => {
    return dispatch => {
        dispatch(actionDisplayInfomationSearch(data))
    }
}

const InitState = {
    displayPanel: false,
    displayInfomationSearch: false,
}

export default function MapToolsPanelReducers(state = InitState, action) {
    switch (action.type) {
        case DISPLAYMAPTOOLSPANEL: return { ...state, displayPanel: action.data };
        case DISPLAYINFOMATIONPOPUP: return { ...state, displayInfomationSearch: action.data };
        default: return state
    }
}