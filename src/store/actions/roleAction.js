import apiURL from "../../config/apiConfig";
import axios from "axios";
import {SET_SELECTED_ROLE,SET_ROLE_LIST} from "../types/actionTypes"

export const setSelectedRole = (roleId) => ({
  type: SET_SELECTED_ROLE,
  payload: roleId,
});

export const fetchRoleList = () => async  (dispatch) => {
  try {
    const res = await axios.get(apiURL+`Users/Role`);
    console.log(res.data,"LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
    dispatch({ type: SET_ROLE_LIST, payload: res.data });
  } catch (error) {
    console.error("fetching role list:", error);
  }
};
