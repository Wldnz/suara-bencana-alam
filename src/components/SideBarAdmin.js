
const sideBarAdmin = () => {
    return(<div className=" mt-5 ml-5 w-64 bg-white h-screen fixed shadow-lg flex flex-col items-center pt-6 px-4 rounded-lg z-40">
        <img src="/image/ic_logo_biru.svg" alt="logo" className="w-12 h-12 mb-2"/>
            <h2 className="text-xl font-bold text-blue-600 text-center">Suara Bencana Alam</h2>
            <hr className="w-full border-t-2 border-[#6475DE] mt-2"/>
            <h3 className="text-lg font-semibold text-black w-full mt-4">Main Menu</h3>
            <ul className="mt-2 space-y-4 text-gray-700 w-full">
                <li className="flex items-center font-medium">
                    <img src="/image/ic_home.svg" alt="home" className="w-6 h-6 mr-2"/> 
                    <a href="/admin/dashboard" className="hover:text-blue-600 flex-1">Dashboard</a>
                </li>
                <li className="flex items-center font-medium relative">
                    <img src="/image/ic_notification.svg" alt="notification" className="w-6 h-6 mr-2"/> 
                    <a href="/admin/notification" className="hover:text-blue-600 flex-1">Notification</a>
                    <span className="ml-auto bg-[#1732E1] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">2</span>
                </li>
                <li className="flex items-center font-medium">
                    <img src="/image/ic_map.svg" alt="maps" className="w-6 h-6 mr-2"/> 
                    <a href="/maps" className="hover:text-blue-600 flex-1">Natural Disaster Maps</a>
                </li>
                <li className="flex items-center font-medium">
                    <img src="/image/ic_sirene.svg" alt="report" className="w-6 h-6 mr-2"/> 
                    <a href="/admin/reports" className="hover:text-blue-600 flex-1">Natural Disaster Reports</a>
                </li>
                <li className="flex items-center font-medium">
                    <img src="/image/ic_article.svg" alt="Article" className="w-6 h-6 mr-2"/> 
                     <a href="/admin/articles" className="hover:text-blue-600 flex-1">Manage Articles</a>
                </li>
                <li className="flex items-center font-medium">
                    <img src="/image/ic_setting.svg" alt="Setting" className="w-6 h-6 mr-2"/> 
                    <a href="/admin/settings" className="hover:text-blue-600 flex-1">settings</a>
                </li>
            </ul>
    </div>
    )
}

export default sideBarAdmin;