import { SET_SELECTED_ROLE, SET_ROLE_LIST } from '../types/actionTypes';

const initialState = {
  selectedRoleId: null,
  roleList: [],
};

export const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_ROLE:
      return { ...state, selectedRoleId: action.payload };
    case SET_ROLE_LIST:
      return { ...state, roleList: action.payload };
    default:
      return state;
  }
};