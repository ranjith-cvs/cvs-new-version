import apiURL from "../config/apiConfig";

const getFetch = (uri, method, data = {}) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
    }
    if (method == "POST" || method == "PUT") {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(data)
    }
    return fetch(`${apiURL}${uri}`, options)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(error => reject(error));
  })
}

export default getFetch