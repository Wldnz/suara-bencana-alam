import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import NavbarAdmin from "../../components/NavbarAdmin";
import akunku from "../../Model/Account";
import Api from "../../Model/Api";
import ENV from "../../Model/env";
const Account = () => {

    const [account, setAccount] = useState({
            name : "",
            email : "",
        });
    
        useEffect(() => {
            async function getAccount(){
                const akun = await akunku.getAccount();
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

        const handleChange = (e) => {
            const { name, value } = e.target;
            setAccount({
                ...account,
                [name] : value
            })
        }

        const handleSubmit = async (e) => {
            const { name, fullname, phone } = account;
            const changePhone = phone !== account.defaultPhone;
            const dataEncoded = new URLSearchParams({ name, fullname, phone, changePhone }).toString();
            try {
                <Loading></Loading>
              await Api().put(`/user`, dataEncoded, {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              });
              alert("Profil berhasil diperbarui!");
              window.location.reload();
            } catch (error) {  
              alert(error.response.data.message);
            }
          };

    return(<div className="flex min-h-screen">
        
        <NavbarAdmin/>

        {/* <!-- Settings Content --> */}
        <div className="ml-72 mt-24 p-6 w-full">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <img src="/image/profile.png" alt="Profile" className="w-12 h-12 rounded-full"/>
                    <span className="text-xl font-semibold">{account.name}</span>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 cursor-not-allowed">Upload New</button>
            </div>

            {/* <!-- Account Setting Form --> */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Account Setting</h2>

                <label className="block text-gray-700 font-medium">Username</label>
                <input name="name" type="text" className="w-full p-3 border border-gray-300 rounded-lg mb-4" placeholder="Enter Username" value={account.name} required  onChange={handleChange}/>

                <label className="block text-gray-700 font-medium">Fullname</label>
                <input name="fullname" type="text" className="w-full p-3 border border-gray-300 rounded-lg mb-4" placeholder="Enter fullname" value={account.fullname} required onChange={handleChange}/>

                <label className="block text-gray-700 font-medium">Email</label>
                <input name="email" type="email" className="w-full p-3 border border-gray-300 rounded-lg mb-4" placeholder="Enter a valid email address" value={account.email} readOnly onChange={handleChange}/>

                <label className="block text-gray-700 font-medium">Phone</label>
                <input name="phone" type="text" className="w-full p-3 border border-gray-300 rounded-lg mb-4" placeholder="Enter a valid phone" value={account.phone} maxLength={12} minLength={11} required onChange={handleChange}/>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700" onClick={handleSubmit}>Update Information</button>
            </div>

            {/* <!-- Back Button --> */}
            <div className="mt-6">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center" onClick={() => window.location.href = window.location.origin + "/admin/settings"}>Back</button>
            </div>
        </div>
    </div>
    )
};

export default Account;