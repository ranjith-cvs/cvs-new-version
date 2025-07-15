import { SET_SELECTED_BRANCH, SET_BRANCH_LIST } from '../types/actionTypes';

const initialState = {
  selectedBranchId: null,
  branchList: [],
};

export const branchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_BRANCH:
      return { ...state, selectedBranchId: action.payload };
    case SET_BRANCH_LIST:
      return { ...state, branchList: action.payload };
    default:
      return state;
  }
};
