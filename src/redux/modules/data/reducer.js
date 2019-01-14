import { SET_DATA } from './actionTypes';

const initialState = {
    simpleData: [],
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_DATA: {
            const { data, dataType } = action;
            return { ...state, [dataType]: data };
        }
        default:
            return state;
    }
}
