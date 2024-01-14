const HANDLEOUTSIDEFUNCTION = "OPENLAYER/HANDLEOUTESIDEFUNCTION";

const creatActionHandleOutsideFunction = (data) => ({ type: HANDLEOUTSIDEFUNCTION, data: data })

export const SetHandleOutsideFunction = (data) => {
    return (dispatch) => {
        dispatch(creatActionHandleOutsideFunction(data))
    }
}

const DefaultState = {
    handleOutSideFunction: () => { },
}

export default function OpenlayerReducer(state = DefaultState, action) {
    switch (action.type) {
        case HANDLEOUTSIDEFUNCTION: return { ...state, handleOutSideFunction: action.data }
        default: return state
    }
};