import { useEffect, useState } from "react";
import Account from "../../Model/Account";
import ENV from "../../Model/env";
import Api from "../../Model/Api";
import NavbarAdmin from "../../components/NavbarAdmin";

const Dashboard = () => {

    const [account, setAccount] = useState({
        name : "",
    });

    const [reports, setReports] = useState([]);
    const [viewArticles, setViewArticles] = useState(0);

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

      useEffect(() => {
        async function getViews(){
            try{
                const { data } = await Api().get('/article-views');
                setViewArticles(data.views || 0);
            }catch(errorMessage){
                setViewArticles(0);
            }
        }
        getViews();
      },[])


    return(<div className="relative min-h-screen flex">
        <NavbarAdmin/>
        {/* <!-- Main Content --> */}
        <div className="flex-1 p-8 ml-72 pt-32">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 id="greeting" className="text-2xl font-bold">Hello, {account.name || "Guest"} </h1>
              <p className="text-gray-600">Welcome Back! We Provide Natural Disaster Reports</p>
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center border p-2 rounded-lg">
                <img src="/image/ic_calenders.svg" alt="calendar" className="w-5 h-5 mr-2" />
                <input type="date" value={new Date().toISOString().split('T')[0]} 
                onChange={(e) => console.log(e.target.value)}/>
              </div>
              <div className="flex items-center border p-2 rounded-lg">
                <img src="/image/ic_filter.svg" alt="filter" className="w-5 h-5 mr-2" />
                <span>Filter</span>
              </div>
            </div>
          </div>
    
          {/* <!-- Cards --> */}
          <div className="grid grid-cols-4 gap-6 mb-8">
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
            <div className="bg-blue-500 text-white p-8 text-center rounded-lg shadow-md">
              <h2 className="text-2xl font-bold">{viewArticles}</h2>
              <p>Visitor Articles</p>
            </div>
          </div>
    
          {/* <!-- Tabel laporan --> */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full">
            <div className="flex justify-between items-center mb-4">
              <div>
                <label for="search" className="mr-2">Search:</label>
                <input type="text" id="search" className="border p-2 rounded-lg" placeholder="Cari laporan..." />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border p-2 rounded-lg">
                  <img src="/image/ic_calenders.svg" alt="calendar" className="w-5 h-5 mr-2" />
                  <span>01-April-2025</span>
                </div>
                <div className="flex items-center border p-2 rounded-lg">
                  <img src="/image/ic_filter.svg" alt="filter" className="w-5 h-5 mr-2" />
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
                </tr>
              </thead>
              <tbody id="reportTable">
                    {/* {reports? <tr><td colspan="5" className="text-center text-gray-500 p-4">Loading...</td></tr> : (
                        
                    )} */}
                   {reports &&  reports.map(value => {
                    console.log(value);
                    return <tr className="">
                        <td className="border p-2 text-center">{value.informer}</td>
                        <td className="border p-2 text-center">{value.type}</td>
                        <td className="border p-2 text-center">{new Date(value.created_at).toLocaleDateString()}</td>
                        <td className="border p-2 text-center">{new Date(value.updated_at).toLocaleDateString()}</td>
                        <td className="border p-2 text-center">{value.status}</td>
                    </tr>
                   })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
}

export default Dashboard;