import NavbarAdmin from "../../components/NavbarAdmin";

const Notification = () => {
    return(<>
    
    <NavbarAdmin/>

    <main className="ml-64 p-6 pt-24">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto">
            <header className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <button className="bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2">
                    <span>Filter</span>
                    <img src="/image/ic_filter.svg" className="w-5 h-5"/>
                </button>
            </header>

            <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                    <div>
                        <h3 className="font-semibold">Community just reported a natural disaster</h3>
                        <p className="text-sm text-gray-600">Welcome Back! We Provide Natural Disaster Reports</p>
                    </div>
                    <span className="bg-blue-500 w-3 h-3 rounded-full"></span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                    <div>
                        <h3 className="font-semibold">Community just reported a natural disaster</h3>
                        <p className="text-sm text-gray-600">Welcome Back! We Provide Natural Disaster Reports</p>
                    </div>
                    <span className="bg-blue-500 w-3 h-3 rounded-full"></span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                    <div>
                        <h3 className="font-semibold">Community just reported a natural disaster</h3>
                        <p className="text-sm text-gray-600">Welcome Back! We Provide Natural Disaster Reports</p>
                    </div>
                    <span className="bg-blue-500 w-3 h-3 rounded-full"></span>
                </div>
            </div>
        </div>
    </main>
    </>)
}

export default Notification;