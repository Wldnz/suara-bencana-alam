const axios = require('axios');
function Api(){
    const api =  axios.create({
        baseURL : "http://localhost:3000",
        withCredentials : true
    });
    return api;
}
module.exports = Api;