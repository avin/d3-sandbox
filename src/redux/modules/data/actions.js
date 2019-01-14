import { SET_DATA } from './actionTypes';

export function setData(dataType, data) {
    return {
        type: SET_DATA,
        dataType,
        data,
    };
}
