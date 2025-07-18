import axios from "axios";
import apiURL from "../../config/apiConfig";
import {SET_SELECTED_BRANCH,SET_BRANCH_LIST} from "../types/actionTypes"

export const setSelectedBranch = (branchId) => ({
  type: SET_SELECTED_BRANCH,
  payload: branchId,
});

export const fetchBranchList = () => async  (dispatch) => {
  try {
    const res = await axios.get(apiURL+`Entity/Edit?userId=${6}`);
    dispatch({ type: SET_BRANCH_LIST, payload: res.data });
  } catch (error) {
    console.error("fetching branch list:", error);
  }
};
