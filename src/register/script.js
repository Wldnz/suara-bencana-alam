if(location.href.includes('register')) {
    const Account = require("../../utilities/Account");
    const messageElement = document.getElementById("message");
    document.getElementById('form-login-user').addEventListener('submit',async (e) => {
        e.preventDefault();
        const emailElement = document.getElementById("email-message");
        const phoneElement = document.getElementById("phone-message");
        const name = e.target[0].value;
        const fullname = e.target[1].value;
        const email = e.target[2].value;
        const phone = e.target[3].value;
        const password = e.target[4].value;
        const { message = "", email : emailMessage = "", phone : phoneMessage = "" } = await Account.register({ name, fullname, email, phone, password });
        emailElement.textContent = emailMessage;
        emailElement.classList.remove('hidden')
        phoneElement.textContent = phoneMessage;
        phoneElement.classList.remove('hidden')
        messageElement.textContent = message;
        messageElement.classList.remove('hidden')
    });
};

