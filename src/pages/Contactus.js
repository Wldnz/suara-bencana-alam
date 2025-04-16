import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const confirmSend = window.confirm(
      "Apakah anda yakin data yang diisi sudah benar?\nPastikan kembali sebelum melanjutkan."
    );

    if (!confirmSend) return;

    setLoading(true);

    emailjs
      .sendForm(
        "service_p3r0xrv",     
        "template_8vvx5yu",    
        formRef.current,
        "26NxG6cQahGI6ZZP1"      
      )
      .then(
        () => {
          setLoading(false);
          alert("Pesan berhasil dikirim!");
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          alert("Terjadi kesalahan. Coba lagi nanti.");
        }
      );
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-white rounded shadow-lg">
      {/* Formulir */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex-1 space-y-4"
      >
        <h2 className="text-xl font-bold mb-2">
          Formulir Kritik dan Saran
        </h2>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Masukkan Nama lengkap anda..."
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Masukkan email anda..."
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tuliskan pesan anda disini..."
          required
          className="w-full p-2 border border-gray-300 rounded h-32"
        />

        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? "Mengirim..." : "Kirim Pesan"}
        </button>
      </form>

      {/* Informasi Kontak */}
      <div className="flex-1 space-y-4">
        <h2 className="text-xl font-bold mb-2">Informasi Contact</h2>
        <p>📱 WhatsApp: <strong>+62 00 0109 082</strong></p>
        <p>📧 Email: <strong>suarabencana@gmail.com</strong></p>
        <p>📷 Instagram: <strong>@SuaraBencana</strong></p>
      </div>
    </div>
  );
};

export default ContactUs;
