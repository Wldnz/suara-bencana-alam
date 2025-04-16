import { useEffect, useState } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import Account from "../../Model/Account";
import ENV from "../../Model/env";
import Api from "../../Model/Api";

const Password =() => {

    const [account, setAccount] = useState({
        name : "",
        email : "",
    });

    const [token, setToken] = useState('');

    const [message, setMessage] = useState('');
    

    useEffect(() => {
        async function getAccount(){
            const akun = await Account.getAccount();
            if(!akun){
              return ENV.returnToLogin();
            }
            const { id, name, fullname, email, phone, role } = akun.data;
            if(role && role === "user"){
              return ENV.returnToDashboard();
            }
            setAccount({ id, name, fullname, phone, email, defaultPhone : phone });
        }
        getAccount();
      },[]);

    useEffect(() => {
        if(!account.email || token) return;
        async function getToken(){
            try{
                const { data } = await Api().post('user/change-password-token', new URLSearchParams({ email : account.email }).toString() , {
                    headers : {
                        "Content-Type" : "application/x-www-form-urlencoded"
                    }
                });
                setToken(data.token);
            }catch(error){
                alert(error.response.data.message)
            }
        }
        getToken();
      },[account]);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setAccount({
            ...account,
            [name] : value
        })
      }

      const handleSubmit = async(e) => {
        if(account.password !== account.password2){
            alert('Sorry!, You Must Input Same Password On Password And Confirm Password')
        }else{
            if(!token) return;
            try{
                const { data } = await Api().put(`/user/change-password/${token}`, new URLSearchParams({ newPassword : account.password }).toString(), {
                    headers : {
                        "Content-Type" : "application/x-www-form-urlencoded"
                    }
                });
                alert('successfully change password');
                window.location.reload();
            }catch(error){
                setMessage(error.response.data.message);
                alert(error.response.data.message);
            }
        }
      }

    return(<div className="flex min-h-screen">
   
        <NavbarAdmin/>

        {/* <!-- Settings Content --> */}
        <div className="ml-72 mt-24 p-6 w-full">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <img src="/image/profile.png" alt="Profile" className="w-12 h-12 rounded-full"/>
                    <span className="text-xl font-semibold">Wildan</span>
                </div>
            </div>

            {/* <!-- Account Setting Form --> */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Chenge Password</h2>

                <label className="block text-gray-700 font-medium">New Password</label>
                <input name="password" type="email" className="w-full p-3 border border-gray-300 rounded-lg mb-4" placeholder="Enter New Password" onChange={handleChange}/>

                <label className="block text-gray-700 font-medium">Confirm New</label>
                <input name="password2" type="text" className="w-full p-3 border border-gray-300 rounded-lg mb-4" placeholder="Confirm New" onChange={handleChange}/>

                {message && <p className="text-red-500 mb-1 w-full text-center">{message}*</p>}
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700" onClick={handleSubmit}>Update Password</button>
            </div>

            {/* <!-- Back Button --> */}
            <div className="mt-6">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center">Back</button>
            </div>
        </div>
    </div>)
}

export default Password;