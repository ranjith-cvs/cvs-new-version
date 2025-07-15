let apiURL = '';
console.log(window.location.hostname, "HOST NAME")
if (window.location.hostname === 'localhost') {
  apiURL = 'http://localhost:5039/api/';
} else if (window.location.hostname === 'covdevhana.veritycloud.com') {
  apiURL = 'http://covdevhana.veritycloud.com:8087/api/';
} else {
  apiURL = 'http://covdevhana.veritycloud.com:8087/api/';
}

export default apiURL;