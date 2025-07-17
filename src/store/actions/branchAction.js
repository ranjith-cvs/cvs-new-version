import apiURL from "../../config/apiConfig";
import axios from "axios";
import {SET_SELECTED_BRANCH,SET_BRANCH_LIST} from "../types/actionTypes"

export const setSelectedBranch = (branchId) => ({
  type: SET_SELECTED_BRANCH,
  payload: branchId,
});

export const fetchBranchList = () => async  (dispatch) => {
  try {
    let Id = localStorage.getItem("id");
    const res = await axios.get(apiURL+`Entity/Edit?userId=${Id}`);
    dispatch({ type: SET_BRANCH_LIST, payload: res.data });
  } catch (error) {
    console.error("fetching branch list:", error);
  }
};
