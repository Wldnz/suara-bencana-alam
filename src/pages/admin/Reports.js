import { useEffect, useState } from "react";
import Account from "../../Model/Account";
import ENV from "../../Model/env";
import Api from "../../Model/Api";
import { Link } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin";

const Reports = () => {

    const [account, setAccount] = useState({
        name : "",
    });

    const [reports, setReports] = useState([]);
    
    useEffect(() => {
        async function getAccount(){
            const akun = await Account.getAccount();
            if(!akun){
              return ENV.returnToLogin();
            }
            const { name, role } = akun.data;
            if(role && role === "user"){
              return ENV.returnToDashboard();
            }
            setAccount({ name });
        }
        getAccount();
      },[]);

      useEffect(() => {
        async function getReports(){
            try{
                const { data } = await Api().get('/reports');
                setReports(data?.data || []);
            }catch(errorMessage){
                setReports([]);
            }
        }
        getReports();
      },[])

    return(<div className="relative min-h-screen flex">
        
        <NavbarAdmin/>

        {/* <!-- Main Content --> */}
        <div className="flex-1 p-8 ml-72 pt-32">
            <h1 className="text-2xl font-bold">Hello, {account.name}</h1>
            <p className="text-gray-600">Welcome Back! We Provide Natural Disaster Reports</p>

            <div className="grid grid-cols-4 gap-6 mb-8 mt-5">
                <div className="bg-blue-500 text-white p-8 text-center rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold">{reports.filter(value => value.status === "process" || value.status === "completed").length}</h2>
                    <p>Natural Disaster</p>
                </div>
                <div className="bg-blue-500 text-white p-8 text-center rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold">{reports.length}</h2>
                    <p>Natural Disaster Reports</p>
                </div>
                <div className="bg-blue-500 text-white p-8 text-center rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold">{reports.filter(value => value.status === "process").length}</h2>
                    <p>Reports on "Process"</p>
                </div>
          </div>


            <div className="flex justify-end mt-6 mb-4">
                <a href={'/report'} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Buat Laporan</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <label for="search" className="mr-2">Search:</label>
                        <input type="text" id="search" className="border p-2 rounded-lg" placeholder="Cari laporan..."/>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center border p-2 rounded-lg">
                            <input 
                                classNameName="cursor-pointer"
                                type="date" value={new Date().toISOString().split('T')[0]} 
                            />
                        </div>
                        <div className="flex items-center border p-2 rounded-lg">
                            <img src="/image/ic_filter.svg" alt="filter" className="w-5 h-5 mr-2"/>
                            <span>Filter</span>
                        </div>
                    </div>
                </div>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Pelapor</th>
                            <th className="border p-2">Nama Bencana</th>
                            <th className="border p-2">Created at</th>
                            <th className="border p-2">Updated at</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Detail</th>
                        </tr>
                    </thead>
                    <tbody id="reportTable">
                        {reports && reports.map(value => {
                            let colorStatus = 'text-blue-500';
                            if(value.status === 'rejected') colorStatus = 'text-red-500' 
                            if(value.status === 'process') colorStatus = 'text-yellow-500' 
                            if(value.status === 'completed') colorStatus = 'text-green-500' 
                            return <tr className="text-center">
                            <td className="border p-2">{value.informer}</td>
                            <td className="border p-2">{value.type}</td>
                            <td className="border p-2">{new Date(value.created_at).toLocaleDateString()}</td>
                            <td className="border p-2">{new Date(value.updated_at).toLocaleDateString()}</td>
                            <td className={`border p-2 ${colorStatus}`}>{value.status}</td>
                            <td className={`border p-2`}>
                                <a className="text-blue-400 underline"
                                href={'/admin/reports/'+value.report_id}>Detail</a>
                            </td>
                        </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    )
}

export default Reports;