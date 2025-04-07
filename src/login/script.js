const Account = require("../../utilities/Account");

document.getElementById('form-login-user').addEventListener('submit',async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    
    console.log(await Account.login( email, password ));

})