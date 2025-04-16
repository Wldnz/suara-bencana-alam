import { useEffect, useState } from "react";
import Account from "../Model/Account";
import ENV from "../Model/env";


const Register = () => {

    useEffect(() => {
        async function checkAccount(){
            const akun = await Account.getAccount();
            if(akun){
                const { role } = akun.data;
                if(role && role === "admin"){
                    ENV.returnToDashboardAdmin();
                }else if(role && role === "user"){
                    ENV.returnToDashboard();
                }
            }
          }
        checkAccount();
    },[])

    const [registerData, setRegisterData] = useState({
        name : "",
        fullname : "",
        email : "",
        phone : "",
        password : "",
    });

    const [messageInput, setMessageInput] = useState({ 
        info : "", 
        email : "",
        phone : "",
     });

    const submitForm = async(e) => {
        e.preventDefault();
        const message = await Account.register(registerData);
        setMessageInput({
            info : !message.hasOwnProperty('email') || !message.hasOwnProperty('phone')? message : '',
            email : message?.email,
            phone : message?.phone
        })
    }

    return(
        <main className="min-w-[300px] w-screen min-h-dvh h-max flex flex-col md:flex-row text-xl text-white">
        <aside className="md:w-[58%] hidden min-h-dvh h-max mt-20 ml-10 md:flex flex-col gap-5 z-10">
            <h2 className="w-max font-bold text-4xl text-white">Halo, <br/>Selamat Datang</h2>
            <p className=""> Kamu bisa melaporkan kejadian bencana <br/> alam setelah mempunyai akun lho</p>
            <p className="">Sudah punya akun?</p>
            <a href="./login" className="w-max p-2 px-8 font-medium text-xl rounded-lg border-[.2px] border-solid">Masuk Disini</a>
        </aside>
        <aside className="w-full md:w-[42%] text-black ">
            <h2 className="mt-10 md:mt-12 mb-3 text-center text-[#3D77CF] font-bold text-3xl">SIGN UP</h2>
            <p className={`mb-3 ${messageInput.info? "" : "hidden"} text-red-600 text-lg font-medium text-center`} id="message">{messageInput.info}</p>
            <form action="#" method="post" className="w-full flex flex-col gap-4 items-center md:items-start" id="form-login-user" onSubmit={submitForm}>
                <div className="w-11/12 md:w-full flex flex-col gap-1.5">
                    <label htmlFor="name" className="font-medium text-[21px]">Name<span className="text-red-600">*</span></label>
                    <input className="md:w-11/12 h-12 px-2 py-1 text-lg bg-white rounded-sm outline-3.5 outline-[#3D77CF] " 
                    type="text" name="name" id="name" placeholder="Masukkan name Anda..." minLength="3" maxLength="16" required onChange={(e) => setRegisterData(prev => ({ ...prev, name : e.target.value}))}/>
                </div>
                <div className="w-11/12 md:w-full flex flex-col gap-1.5">
                    <label htmlFor="fullname" className="font-medium text-[21px]">FullName<span className="text-red-600">*</span></label>
                    <input className="md:w-11/12 h-12 px-2 py-1 text-lg bg-white rounded-sm outline-3.5 outline-[#3D77CF] " 
                    type="text" fullname="fullname" id="fullname" placeholder="Masukkan fullname Anda..." minLength="3" maxLength="120" required onChange={(e) => setRegisterData(prev => ({ ...prev, fullname : e.target.value}))}/>
                </div>
                <div className="w-11/12 md:w-full flex flex-col gap-1.5">
                    <label htmlFor="email" className="font-medium text-[21px]">Email<span className="text-red-600">*</span></label>
                    <input className="md:w-11/12 h-12 px-2 py-1 text-lg bg-white rounded-sm outline-3.5 outline-[#3D77CF] " 
                    type="email" name="email" id="email" placeholder="Masukkan Email Anda..." minLength="8" maxLength="120" required onChange={(e) => setRegisterData(prev => ({ ...prev, email : e.target.value}))}/>
                    <p className={`text-red-600 text-xs font-medium" id="email-message ${messageInput.email? "" : "hidden"}`}>{messageInput.email}</p>
                </div>
                <div className="w-11/12 md:w-full flex flex-col gap-1.5">
                    <label htmlFor="phone" className="font-medium text-[21px]">Phone<span className="text-red-600">*</span></label>
                    <input className="md:w-11/12 h-12 px-2 py-1 text-lg bg-white rounded-sm outline-3.5 outline-[#3D77CF] " 
                    type="text" name="phone" id="phone" placeholder="Masukkan nomor telepon Anda..." minLength="11" maxLength="12" required onChange={(e) => setRegisterData(prev => ({ ...prev, phone : e.target.value}))}/>
                    <p className={`text-red-600 text-xs font-medium ${messageInput.phone? "" : "hidden"}`} id="phone-message">{messageInput.phone}</p>
                </div>
                <div className="w-11/12 md:w-full flex flex-col gap-1.5">
                    <label htmlFor="password" className="font-medium text-[21px]">Password<span className="text-red-600">*</span></label>
                    <input className="md:w-11/12 h-12 px-2 py-1 text-lg bg-white rounded-sm outline-3.5 outline-[#3D77CF] " 
                    type="password" name="password" id="password" placeholder="Masukkan password Anda..." minLength="16" maxLength="120" required onChange={(e) => setRegisterData(prev => ({ ...prev, password : e.target.value}))}/>
                </div>
                <button className="w-11/12 h-11 font-bold text-lg bg-blue-500 p-1.5 text-white rounded-lg cursor-pointer">Mulai Sekarang</button>
                <div className="w-11/12 flex flex-col gap-1">
                    <p className="w-11/12 text-lg">Butuh Bantuan? <a href="./contact" className="w-max text-blue-600">Hubungi kami...</a></p>
                    <p className="md:hidden text-lg">Sudah punya akun? <a href="./login" className="w-max text-blue-600">Masuk Disini...</a></p>
                </div>
            </form>
        </aside>
        {/* <!-- background! --> */}
        <div className="w-full md:w-7/12 hidden md:block min-h-dvh h-full absolute top-0 left-0 clip-triangle bg-auth"></div>
    </main>
    )
}

export default Register;