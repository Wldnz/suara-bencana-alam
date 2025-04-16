import axios from 'axios'
import ENV from './env';
import Account from './Account';
function Api(){
    const api =  axios.create({
        baseURL : ENV.getAPI_URL(),
        withCredentials : true,
        headers : {
            "Authorization" :  Account.getToken() || null
        }
    });
    return api;
}
export default Api;