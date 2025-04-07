
const Api = require('./Api');

const baseUrl = location.origin;

class Account{


    static async getAccount(){
       try{
            const { data, status } = await Api().get('/user');
            const { name, fullname, role, status: statusAccount } = data.data;
            return { name, fullname, role, status : statusAccount };
       }catch(errorMessage){
            if(status === 400) return location.href = baseUrl + "/login";
            if(status === 500); // lakukan sesuatu disini ya
       }
    }
    
    static async register({ name, fullname, email, phone, password }){
        try{
            const { data, status } =  await Api().post('/user', { name, fullname, password, email, phone, password });
            return location.href = baseUrl + "/login";
        }catch(errorMessage){
            const { data, status } = errorMessage.response; 
            if(status === 400){
                const { email, phone } =  data.message;
                return { email, phone };
            }
            if (status === 500) {
                // doo something here...
              return { message : data.message };
            }
        }
    }

    static async login( email, password ){
        try{
            await Api().post("/user/session", {
                email,
                password,
              });
            const { status: statusAccount } = this.getAccount();
            if (statusAccount === "admin") {
                location.href = baseUrl + "/admin/dashboard";
            }else {
                location.href = baseUrl + "/";
            }
        }catch(errorMessage){
            const { data, status } = errorMessage.response
            if (status === 400 || status === 404) {
                return { message : data.message };
            }else if(status === 500){
                // doo something here...
                return { message : data.message };
            }
        }
    }

}

module.exports = Account;