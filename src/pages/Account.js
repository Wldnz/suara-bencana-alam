import React, { useEffect, useState } from "react";
import ENV from "../Model/env.js";
import Akun from '../Model/Account.js';
import Api from "../Model/Api.js";
const Account = () => {
  
  const [formData, setFormData] = useState({
    id : "",
    name: "",
    fullname: "",
    email: "",
    defaultPhone : "",
    phone : "",
  });
  const [personalMessage, setPersonalMessage] = useState(""); 
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);


  // Ambil data user
  useEffect(() => {
    async function getAccount(){
        const akun = await Akun.getAccount();
        if(!akun){
          return ENV.returnToLogin();
        }
        const { id, name, fullname, email, phone, role } = akun.data;
        if(role && role === "admin"){
          return ENV.returnToDashboardAdmin();
        }
        setFormData({ id, name, fullname, phone, email, defaultPhone : phone });
    }
    getAccount();
  },[])
  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        const res = (await Api().get(`${ENV.getAPI_URL()}/reports`)).data;
        const data = await res?.data || [];
        setReports(data);
      } catch (error) {
        console.error("Gagal mengambil laporan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserReports();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, fullname, phone } = formData;
    const changePhone = phone !== formData.defaultPhone;
    const dataEncoded = new URLSearchParams({ name, fullname, phone, changePhone }).toString();
    try {
      await Api().put(`/user`, dataEncoded, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      alert("Profil berhasil diperbarui!");
    } catch (error) {  
      setPersonalMessage(error.response.data.message);
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Account</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="name"
            placeholder="Nama pengguna yang terdaftar"
            className="mt-1 p-1.5 block w-full border-gray-300 rounded-md shadow-sm"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
            Nama Lengkap
          </label>
          <input
            type="text"
            id="fullname"
            placeholder="Masukkan nama lengkap sesuai identitas"
            className="mt-1 p-1.5 block w-full border-gray-300 rounded-md shadow-sm"
            value={formData.fullname}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Masukkan alamat email yang valid"
            className="mt-1 p-1.5 block w-full border-gray-300 rounded-md shadow-sm"
            value={formData.email}
            onChange={() => {}}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Nomor Handphone
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="Masukkan nomor telepon aktif"
            className="mt-1 p-1.5 block w-full border-gray-300 rounded-md shadow-sm"
            value={formData.phone}
            minLength={11}
            maxLength={12}
            onChange={handleChange}
          />
        </div>

        {personalMessage && <div className="mb-4">
          <p className="text-red-500">{personalMessage + "*"}</p>
        </div>}

        <div className="flex gap-2">
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Simpan
          </button>
          <button
            type="button"
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => {
              if(window.confirm('apakah kamu yakin ingin keluar akun? (logout)')){
                window.localStorage.removeItem('token');
                window.location.reload()
              }
            }}
          >
            Keluar Sesi
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Riwayat Laporan Saya</h2>
        {loading ? (
          <p>Memuat laporan...</p>
        ) : reports.length === 0 ? (
          <p>Tidak ada laporan yang ditemukan.</p>
        ) : (
          reports.map((report, index) => (
            <div key={index} className="bg-gray-200 p-4 mb-2 rounded">
              <h3 className="font-semibold">{report.title}</h3>
              <p>
                📅 {new Date(report.created_at).toLocaleDateString()} • 📍 Lokasi: {report.city}, {report.provinci}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Account;
