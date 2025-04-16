import { useState } from "react";

const NavbarAdmin = () => {

    const [showFloat,setShowFloat] = useState(false);

    return(
    <div className="w-full bg-[#1732E1] shadow-md p-4 flex justify-end items-center fixed top-0 left-0 right-0 z-10" onClick={() => showFloat? setShowFloat(false) : {} }>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-9 h-9 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center relative">
                <img src="/image/ic_bell.svg" alt="notification" className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</span>
              </div>
            </div>
            <img src="/image/profile.png" alt="Profile" className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"  onClick={() => setShowFloat(prev => !prev)}/>
            {showFloat && <div className="w-full h-screen absolute top-0 left-0">
                <div className="w-28 h-max bg-white py-2 rounded-lg
                flex flex-col gap-1 justify-center items-center
                absolute top-[80px] right-[5px]">
                    <a href="/admin/settings/account">Account</a>
                    <button className="font-bold text-red-500" onClick={() => {
                        if(window.confirm('are you sure want to log out?')){
                            localStorage.removeItem('token');
                            window.location.reload();
                        }
                    }}>Log Out?</button>
                </div>
            </div>}
          </div>
        </div>
    )
}

export default NavbarAdmin;