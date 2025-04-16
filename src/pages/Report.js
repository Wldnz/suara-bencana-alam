import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import ENV from '../Model/env';
import Account from '../Model/Account.js';
import Api from '../Model/Api.js';

const Report = () => {

  const [personalAccount, setPersonalAccount] = useState({
    name : "",
    fullname : "",
    email : "",
    phone : "",
    role : "",
    status : "" 
  });

  useEffect(() => {
    async function getAccount(){
      const akun = await Account.getAccount();
      if(!akun){
        return ENV.returnToLogin();
      }
      const { name, fullname, email, phone, role } = akun.data;
      setPersonalAccount({ name, fullname, email, phone, role })
    }
    getAccount();
  },[])

  const [formData, setFormData] = useState({
    fullname: '',
    title: '',
    content: '',
    address: '',
    provinci: '',
    city: '',
    type: '',
    incident_at: '',
    damages: 'Tidak Ada Kerusakan Yang Terjadi',
    image: null,
    setuju: false,
  });

  const [preImage,setPreImage] = useState("");
  const [errorReport,setErrorReport] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if(type === "file"){
      const url = URL.createObjectURL(files[0]);
      setPreImage(url);
    }
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.setuju) {
      alert('Silakan setujui syarat dan ketentuan terlebih dahulu.');
      return;
    }

    const reportData = new FormData();
    for (const key in formData) {
      if (key === 'image' && formData[key]) {
        reportData.append('image', formData[key]);
      }else if(key === "incident_at" && formData[key]){
        reportData.append("incident_at", new Date(formData[key]).getTime());
      }else if(key !== "setuju") {
        reportData.append(key, formData[key]);
      }
    }

    try {
      // Kirim ke API lokal
      
      const response = await Api().post("/reports", reportData, {
        headers : {
          "Content-Type" : "multipart/data"
        }
      })

      if (!response.ok){
         const { message } = response.data;
        setErrorReport(message);
      }

      // Kirim ke EmailJS
      const templateParams = {
        user_name: formData.fullname,
        user_email: personalAccount.email,
        kontak: formData.content,
        judul: formData.title,
        deskripsi: formData.content,
        alamat: formData.address,
        provinsi: formData.provinci,
        kota: formData.city,
        tipe: formData.type,
        tanggal: new Date(formData.incident_at).toLocaleDateString(),
        kerusakan: formData.damages,
      };

      await emailjs.send(
        'service_ea4k1yl',
        'template_rs5ghaf',
        templateParams,
        'RLvgfQsvINXhtm3kS'
      );

      alert('Laporan berhasil dikirim!');
      setFormData({
        fullname: '',
        title: '',
        content: '',
        address: '',
        provinci: '',
        city: '',
        type: '',
        incident_at: '',
        damages: 'Tidak Ada Kerusakan Yang Terjadi',
        image: null,
        setuju: false,
      });
      alert('berhasil membuat laporan');
      if(personalAccount.role && personalAccount.role === "admin"){
        return window.location.href = window.location.origin + '/admin/reports'
      }else{
        return window.location.href = window.location.origin + '/account'
      }
    } catch (error) {
      alert('Terjadi kesalahan saat mengirim laporan, Harap Periksa Kembali data yang ingin dikirimkan');
    }
  };

  return (
    <main className="flex-1 p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-xl">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-1">
          Pelaporan Darurat Bencana
        </h2>
        <p className='w-full text-center text-red-600 mb-4'>{errorReport}*</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Gambar Kondisi Bencana</label>
            <input type="file" name="image" accept="image/png, image/jpeg" onChange={handleChange} className="w-full border p-2 rounded-md" />
          </div>
          {preImage && <div className='w-[200px] h-[200px]'>
            <img className='w-full h-full' src={preImage} alt='preImage' />
          </div>}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pelapor</label>
            <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} className="w-full border p-2 rounded-md" placeholder={personalAccount.fullname || "Nama Lengkap"} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Pelapor</label>
            <input type="email" name="email" value={personalAccount.email} onChange={handleChange} className="w-full border p-2 rounded-md" placeholder="Email" required readOnly />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Laporan</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded-md" placeholder="Judul laporan" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Laporan</label>
            <textarea name="content" value={formData.content} onChange={handleChange} rows={3} className="w-full border p-2 rounded-md" placeholder="Deskripsikan kejadian" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap Kejadian</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border p-2 rounded-md" placeholder="Alamat lengkap" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
              <input type="text" name="provinci" value={formData.provinci} onChange={handleChange} className="w-full border p-2 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kota/Kabupaten</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border p-2 rounded-md" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Bencana</label>
              <input type="text" name="type" value={formData.type} onChange={handleChange} className="w-full border p-2 rounded-md" placeholder="Contoh: Gempa, Banjir, Puting Beliung" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kejadian</label>
              <input type="date" name="incident_at" value={formData.incident_at} onChange={handleChange} className="w-full border p-2 rounded-md" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kerusakan yang Terjadi</label>
            <textarea name="damages" value={formData.damages} onChange={handleChange} rows={2} className="w-full border p-2 rounded-md" placeholder="Contoh: Rumah roboh, jalan terputus" />
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" name="setuju" checked={formData.setuju} onChange={handleChange} className="accent-red-500" id="setuju"/>
            <label htmlFor="setuju" className="text-sm text-gray-600">Saya menyetujui syarat dan ketentuan pelaporan</label>
          </div>

          <div className="flex justify-between pt-4">
            <button type="reset" onClick={() => setFormData({
              fullname: personalAccount.fullname, email: personalAccount.email, title: '', content: '',
              address: '', provinci: '', city: '', type: '', incident_at: '',
              damages: 'Tidak Ada Kerusakan Yang Terjadi', image: null, setuju: false,
            })} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              Batal
            </button>
            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Kirim Laporan
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Report;
