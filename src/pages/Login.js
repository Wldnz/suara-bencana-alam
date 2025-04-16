import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import Account from "../Model/Account";
import ENV from "../Model/env";
const Login = () => {

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

    const [loginData, setLoginData] = useState({
        email : "",
        password : "",
        showErrorMessage : false
    });

    const [errorMessage, setErrorMessage ] = useState("");

    const submiForm = async(e) => {
        e.preventDefault();
        const { message = "email atau password ada yang salah" } =  await Account.login( loginData.email, loginData.password );
        setErrorMessage(message);
        setLoginData(prev => ({...prev, showErrorMessage : true}))
    }


    return (<div className="w-screen inter-normal">
    <main className="min-w-[300px] w-screen h-dvh flex flex-col md:flex-row text-xl text-white">
        <aside className="md:w-[58%] hidden h-max mt-20 ml-10 md:flex flex-col gap-5 z-10">
            <h2 className="w-max font-bold text-4xl text-white">Halo, <br/>Selamat Datang</h2>
            <p className=""> Kamu bisa melaporkan kejadian bencana <br/> alam setelah login lho</p>
            <p className="">Belum punya akun?</p>
            <Link to={"/register"} className="w-max p-2 px-8 font-medium text-xl rounded-lg border-[.2px] border-solid">Daftar Disini</Link>
        </aside>
        <aside className="w-full md:w-[42%] text-black ">
            <h2 className="mt-10 md:mt-32 mb-3 text-center text-[#3D77CF] font-bold text-3xl">SIGN IN</h2>
            <p className={`mb-3 ${loginData.showErrorMessage? "block" : "hidden"} text-red-600 text-lg font-medium text-center`} id="message">{errorMessage}</p>
            <form action="#" method="post" className="w-full flex flex-col gap-4 items-center md:items-start" id="form-login-user" onSubmit={submiForm}>
                <div className="w-11/12 md:w-full flex flex-col gap-1.5">
                    <label htmlFor="email" className="font-medium text-[21px]">Email<span className="text-red-600">*</span></label>
                    <input className="md:w-11/12 h-12 px-2 py-1 text-lg bg-white rounded-sm outline-3.5 outline-[#3D77CF] " 
                    type="email" name="email" id="email" placeholder="Masukkan Email Anda..." minLength="8" maxLength="120" required value={loginData.email} onChange={(e) => setLoginData(prev => ({ ...prev, email : e.target.value }) )}/>
                </div>
                <div className="w-11/12 md:w-full flex flex-col gap-1.5">
                    <label htmlFor="password" className="font-medium text-[21px]">Password<span className="text-red-600">*</span></label>
                    <input className="md:w-11/12 h-12 px-2 py-1 text-lg bg-white rounded-sm outline-3.5 outline-[#3D77CF] " 
                    type="password" name="password" id="password" placeholder="Masukkan password Anda..." minLength="16" maxLength="120" required value={loginData.password} onChange={(e) => setLoginData(prev => ({ ...prev, password : e.target.value }) )}/>
                </div>
                <button className="w-11/12 h-11 font-bold text-lg bg-blue-500 p-1.5 text-white rounded-lg cursor-pointer">Mulai Sekarang</button>
                <div className="w-11/12 flex flex-col gap-1">
                    <p className="w-11/12 text-lg">Butuh Bantuan? <a href="/contact" className="w-max text-blue-600">Hubungi kami...</a></p>
                    <p className="md:hidden text-lg">Belum punya akun? <a href="/register" className="w-max text-blue-600">Daftar Disini...</a></p>
                </div>
            </form>
        </aside>
        {/* <!-- background! --> */}
        <div className="w-full md:w-7/12 hidden md:block h-dvh absolute top-0 left-0 clip-triangle bg-auth"></div>
    </main>
</div>)
}

export default Login;