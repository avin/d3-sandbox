import { SET_CONTROLS } from './actionTypes';

export function setControls(controlsType, params) {
    return {
        type: SET_CONTROLS,
        controlsType,
        params,
    };
}
