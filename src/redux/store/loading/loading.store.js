const ADDONECALLINGAPI = "LOADING/ADD";
const REMOVEONECALLINGAPI = "LOADING/REMOVE";

export const AddOneSlotToLoadingQueue = { type: ADDONECALLINGAPI }
export const RemoveOneSlotToLoadingQueue = { type: REMOVEONECALLINGAPI }

const InitState = {
    loadingQueue: []
}

export default function LoadingReducer(state = InitState, action) {
    switch (action.type) {
        case ADDONECALLINGAPI: {
            return { ...state, loadingQueue: [...state.loadingQueue, 1] }
        }
        case REMOVEONECALLINGAPI: {
            const oldState = [...state.loadingQueue];
            oldState.pop()
            return { ...state, loadingQueue: oldState }
        }
        default: return state
    }
}