// import getLoadData from "../utils/loadData";
import { GET_SETTINGS_BRANCH } from "../types/actionTypes";

export const getSettingsBranch = (data) => ({
  type: "GET_SETTINGS_BRANCH",
  payload: data
});

// export const getSettingsDetails = () => {
//   return async (dispatch) => {
//     try {
//       const response = await getLoadData("settings", "GET");
//       dispatch(getSettingsBranch(response));
//     } catch (error) {
//       console.error("Error fetching getallrecordsprodctionTreedata:", error);
//     }
//     finally {
//     }
//   };
// }