
require("./global.css");
require('../src/login/script.js');
require('../src/register/script.js');
require('../src/admin/script.js');
const {animate} = require("motion");
const Account = require("../utilities/Account.js");
async function init(){
    if(location.pathname.includes("admin")){
        // blok kode untuk admin
    }else{
        // blok kode untuk user
    }
    // blok kode untuk di akses di dua pengguna (user dan admin)
    let count = 0;
    document.querySelector("#click-count").addEventListener('click',(e) => document.getElementById("count").textContent = `Count : ${count++}`);
    animate(document.querySelector("#click-count"),
        { scale: [0.4, 1] },
        { ease: "circInOut", duration: 1.2 }
    ) 
}

document.addEventListener('DOMContentLoaded',(e) => init());