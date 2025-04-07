const Account = require("../../utilities/Account");

async function init(){
    if(location.href.includes("admin")){
        const account = await Account.getAccount();
        if(account.status != "admin") location.href = location.origin;
        document.getElementById("nama-admin").textContent = account.name || "admin";
    }
}

init();