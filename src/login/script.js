if(location.href.includes('login')) {
    const Account = require("../../utilities/Account");
    document.getElementById('form-login-user').addEventListener('submit',async (e) => {
        e.preventDefault();
        const messageElement = document.getElementById("message");
        const email = e.target[0].value;
        const password = e.target[1].value;
        const { message = "" } = await Account.login( email, password );
        messageElement.textContent = message;
        messageElement.classList.remove('hidden')
    });
};
