
import Api from "./Api";
import ENV from "./env";

const baseUrl = window.location.origin;
class Account{
    static async getAccount(){
        if(!this.getToken()) return false;
       try{
            const data = await Api().get('/user');
            return data.data;
       }catch(errorMessage){
            const { status } = errorMessage.response; 
            if(status === 400) return window.location.href = baseUrl + "/login";
            if(status === 500); return [];
       }
    }
    
    static async register({ name, fullname, email, phone, password }){
        try{
           const resp = await Api().post('/user', { name, fullname, email, phone, password });
           if(resp.status === 201){
                window.alert('buat akun berhasil dan akan di alihkan ke login selama 5 detik...');
                setTimeout(() => window.location.href = baseUrl + "/login", 5000);    
                return { message : "success create an account", email : "", phone : '' }
           }
           return { message : resp.data.message }
        }catch(errorMessage){
            const { data, status } = errorMessage.response; 
            if(status === 400){
                const { email, phone } =  data.message;
                return { email, phone };
            }
            if (status === 500) {
                // doo something here...
                return [];
            }
        }
    }

    static async login( email, password ){
        const urlEncoded = new URLSearchParams({ email, password }).toString();
        try{
            const { token } = (await Api().post("/user/session", urlEncoded, {
                headers : {
                    "Content-Type" : "application/x-www-form-urlencoded",
                }, 
            })).data;
            localStorage.setItem("token", token);
            const { role } = (await this.getAccount(token)).data;
            console.log(role);
            if (role === "admin") {
               ENV.returnToDashboardAdmin();
            }else if(role === "user") {
                ENV.returnToDashboard()
            }
            return { message : "berhasilll login" }
        }catch(errorMessage){
            console.log(errorMessage)
            const { status } = errorMessage.response;
            if (status === 400 || status === 404) {
                return { message : "Email atau Password tidak dapat ditemukan" };
            }else if(status === 500){
                // doo something here...
                return [];
            }
        }
    }
    
    static logout(){
        const token =  localStorage.getItem("token");
        if(token) {
            localStorage.removeItem('token');
        }
        return window.location.href = baseUrl + "/login";
    }

    static getToken(){
        const token =  localStorage.getItem("token");
        if(!token) {
            return null;
        }
        return token;
    }
}

export default Account;