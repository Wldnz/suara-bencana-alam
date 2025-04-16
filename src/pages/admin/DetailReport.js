import { useEffect, useState } from "react";
import Api from "../../Model/Api";
import { Link, Navigate, useParams } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin";

const DetailReport = () => {

    const [reports, setReports] = useState([]);
    const { id } = useParams();
    const [message, setMessage] = useState('');

    const [location, setLocation] = useState({
        provinci : reports[0]?.provinci,
        city : reports[0]?.city,
        address : reports[0]?.address,
        longitude : reports[0]?.longitude,
        latitude : reports[0]?.latitude,
    });

    const [validationData, setValidationData] = useState({});
    const [showValidation, setShowValidation] = useState(false);



    useEffect(() => {
        async function getReports(){
            try{
                const { data } = await Api().get('/report/'+id);
                setReports(data?.data || []);
                if(data?.data.length > 0 ){
                    setLocation({ 
                        provinci : data.data[0]?.provinci,
                        city : data.data[0]?.city,
                        address  : data.data[0]?.address ,
                        longitude : data.data[0]?.longitude,
                        latitude : data.data[0]?.latitude,
                    })
                }
            }catch(errorMessage){
                setReports([]);
            }
        }
        getReports();
      },[]);

      useEffect(() => {
        async function getValidation(){
            try{
                const { data } = await Api().get('/model-validation/'+id);
                setValidationData(data.message);
            }catch(errorMessage){
            }
        }
        getValidation()
      },[]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocation({
            ...location,
            [name] : name === "latitude" || name === "longitude"? Number(value) : value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const dataUrlEncoded = new URLSearchParams(location).toString();
        console.log(dataUrlEncoded);
        try{
            const { data } = await Api().put(`/locations/${reports[0].location_id}`, dataUrlEncoded , {
                headers : {
                    "Content-Type" : "application/x-www-form-urlencoded"
                }
            });
            setMessage(data.message);
            alert('succesfully update report with id=' + reports[0].location_id);
        }catch(errorMessage){
            alert('failed update report, please scroll to up to see the error message');
            setMessage(errorMessage.response.data.message);
        }
    }

    return(reports.length === 0? <div className="h-dvh flex flex-col items-center justify-center gap-2  ">
        <h2 className="font-bold">NOT FOUND</h2>
        <Link className="bg-blue-400 font-bold text-white p-1 px-2 rounded-lg" 
        to={'/admin/reports'}>Back?</Link>
    </div> : <>
        
        <NavbarAdmin/>

        <form className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-20" onSubmit={handleSubmit}>
            <h1 className="text-xl font-bold">Natural Disaster Report</h1>
            <p className="font-bold text-red-600">{message + "*"}</p>
            <h2 className="mt-10 text-lg font-semibold">Detail Pelapor Bencana Alam <span className="ml-2 h-3 w-3 bg-green-500 rounded-full inline-block"></span></h2>
            <div className="mt-2 border rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Username</td><td className="p-2">{reports[0].informer}</td></tr>
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Full Name</td><td className="p-2">{reports[0].full_informer_name}</td></tr>
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Number Phone</td><td className="p-2">{reports[0].phone}</td></tr>
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Email Address</td><td className="p-2">{reports[0].email}</td></tr>
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Created Account</td><td className="p-2">{new Date(reports[0].user_created_at).toISOString().split('T')[0]}</td></tr>
            </table>
            </div>

            <h2 className="mt-10 text-lg font-semibold">Detail Bencana Alam<span className="ml-2 h-3 w-3 bg-green-500 rounded-full inline-block"></span></h2>
            <div className="mt-2 border rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Title</td><td className="p-2">{reports[0].title}</td></tr>
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Type</td><td className="p-2">{reports[0].type}</td></tr>
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Description</td><td className="p-2">{reports[0].content}</td></tr>
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Damage</td><td className="p-2">{reports[0].damages}</td></tr>
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Fatalities</td><td className="p-2">{reports[0].fatalities}</td></tr>
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Created At</td><td className="p-2">{new Date(reports[0].created_at).toISOString().split('T')[0]}</td></tr>
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Updated At</td><td className="p-2">{new Date(reports[0].updated_at).toISOString().split('T')[0]}</td></tr>
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Current Status</td><td className="p-2">{reports[0].status}</td></tr>
            </table>
            </div>

            <h2 className="mt-10 text-lg font-semibold">Natural Disaster Location<span className="ml-2 h-3 w-3 bg-green-500 rounded-full inline-block"></span></h2>
            <div className="mt-2 border rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
            <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Province</td><td className="p-2"><input type="text" name="provinci" value={location.provinci || reports[0].provinci} onChange={handleChange}/></td></tr>
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">City</td><td className="p-2"><input type="text" name="city" value={location.city || reports[0].city} onChange={handleChange} /></td></tr>
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Address</td><td className="p-2"><input className="w-full" type="text" name="address" value={location.address || reports[0].address} onChange={handleChange} /></td></tr>
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Longitude</td><td className="p-2"><input type="text" name="longitude" value={location.longitude || reports[0].longitude} onChange={handleChange} /></td></tr>
                <tr className="border"><td className="p-2 font-semibold bg-gray-100 w-1/3 text-center">Latitude</td><td className="p-2">{<input type="text" name="latitude" value={location.latitude || reports[0].latitude} onChange={handleChange} />}</td></tr>
            </table>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl ml-auto">
            <h2 className="text-lg font-bold flex items-center">
                Short Summary From Machine Learning
                <span className="ml-1 w-3 h-3 bg-red-600 rounded-full inline-block"></span>
            </h2>
            <p className="mt-2 text-gray-700">
               {validationData.title}   <a className="text-blue-600 font-semibold hover:underline" onClick={() => setShowValidation(true)}>see the detail here...</a>
            </p>

            <div className="mt-6">
                <button type="submit" id="saveButton" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                SAVE CHANGES
                </button>
                <button className="w-full mt-2 bg-gray-200 text-black py-2 rounded-lg hover:bg-gray-300 transition"
                    onClick={() => window.location.href = window.location.origin + '/admin/reports'}
                >
                CANCEL
                </button>
            </div>
            </div>
        </form>
        <div className={`w-screen h-dvh fixed top-0 left-0 bg-white/600 z-[9999] ${showValidation? "flex" : "hidden"} justify-center items-center `} onClick={() => setShowValidation(false)}>
            <div className="w-[400px] h-[500px] bg-white p-5 flex flex-col gap-3 rounded-lg">
                <h2 className="w-full text-center">VALIDATION REPORT</h2>
                <div className="flex flex-col">
                    <p className="font-bold text-2xl">Title</p>
                    <p className="text-sm">{validationData.title}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-bold text-2xl">content</p>
                    <p className="text-sm">{validationData.content}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-bold text-2xl">Image</p>
                    <p className="text-sm">{validationData.image}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-bold text-xl">note</p>
                    <p className="text-sm">{validationData.note}</p>
                </div>
            </div>
        </div>
    </>)   
}

export default DetailReport;