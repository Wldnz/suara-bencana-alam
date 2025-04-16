import NavbarAdmin from "../../components/NavbarAdmin";

const Settings = () => {
    return(
        <div className="flex min-h-screen">
        <NavbarAdmin/>

        {/* <!-- Settings Content --> */}
        <div className="ml-72 mt-24 p-6 w-full">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 mb-4">
                <img src="/image/profile.png" alt="Profile" className="w-12 h-12 rounded-full"/>
                <span className="text-xl font-semibold">Wildan</span>
            </div>
            <div className="flex flex-col space-y-4">
                <a href='/admin/settings/account' className="w-full bg-white p-4 rounded-lg shadow-md text-left font-medium">Account Setting</a>
                <a href='/admin/settings/password' className="w-full bg-white p-4 rounded-lg shadow-md text-left font-medium">Change Password</a>
            </div>
        </div>
    </div>);
}

export default Settings;