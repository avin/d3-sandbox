import { SET_CONTROLS } from './actionTypes';

const initialState = {
    linearChart: {},
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_CONTROLS: {
            const { controlsType, params } = action;

            const currentParams = state[controlsType] || {};

            return { ...state, [controlsType]: { ...currentParams, ...params } };
        }
        default:
            return state;
    }
}
