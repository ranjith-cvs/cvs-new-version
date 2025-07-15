import {GET_SETTINGS_BRANCH}  from '../types/actionTypes';

export const settingsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_SETTINGS_BRANCH':
      return {
        ...state,
        settingsName: action.payload || state.settingsName,
        settingsStatus: action.payload || state.settingsStatus,
      };
    default:
      return state;
  }
};
