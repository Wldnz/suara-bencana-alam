
class ENV{
    static getAPI_URL(){
        // return "http://localhost:3000";
        return "https://api-suara-bencana-alam.vercel.app";
    }
    static returnToDashboard(){
        return window.location.href = window.location.origin;
    }
    static returnToDashboardAdmin(){
        return window.location.href = window.location.origin + "/admin/dashboard";
    }
    static returnToLogin(){
        return window.location.href = window.location.origin + "/login";
    }
    static converToDate(unixTimeStamp){
        new Date(unixTimeStamp).toString()
        return "abc";
    }
}

export  default ENV;