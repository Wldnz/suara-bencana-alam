
const Api = require('./Api');

class Account{
    static async getAccount(){
        const { data, status } = await Api().get('/user');
        console.log(status);
        return false;
    }
    
    static async login( email, password ){
        const { data, status } = await Api().get('/user');
        console.log(data);
        return await Api().post('/user/session', { email, password });
    }

}

module.exports = Account;