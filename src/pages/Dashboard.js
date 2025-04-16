import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import ENV from "../Model/env";

const Dashboard = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get(`${ENV.getAPI_URL()}/articles`)
      .then((response) => {
        setArticles(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
      });
  }, []);

  const showArticles = articles.length > 0 ? articles.slice(0, 3) : [
    {
      id: 0,
      title: "Artikel Default 1",
      description: "Contoh artikel default ketika data tidak tersedia.",
      image_url: "https://picsum.photos/seed/default1/600/300",
    },
    {
      id: 1,
      title: "Artikel Default 2",
      description: "Informasi penting seputar kesiapsiagaan bencana.",
      image_url: "https://picsum.photos/seed/default2/600/300",
    },
    {
      id: 2,
      title: "Artikel Default 3",
      description: "Panduan evakuasi dan penanggulangan bencana.",
      image_url: "https://picsum.photos/seed/default3/600/300",
    },
  ];

  const Card = (title, description, link, icon) => (
    <motion.a
      href={link}
      className="block p-5 bg-red-100 rounded-lg shadow hover:shadow-md transition"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <img src={icon} alt={title} className="w-6 h-6" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.a>
  );

  const galleryImages = [
    "https://asset-2.tstatic.net/lampung/foto/bank/images/banjir-di-sulsel-8-meninggal.jpg",
    "https://rmol.id/images/berita/normal/2024/11/396814_11595301112024_evakuasi_warga_yang_kebanjiran_di_aceh_BPBA.jpg",
    "https://rmol.id/images/berita/normal/2024/11/396814_11595301112024_evakuasi_warga_yang_kebanjiran_di_aceh_BPBA.jpg",
    // bisa tambah lagi nanti kalau mau 6 total
  ];

  return (
    <div className="p-6">
      {/* Welcome */}
      <motion.h1
        className="text-2xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Selamat datang di SuaraBencana!
      </motion.h1>
      <motion.p
        className="text-gray-600 mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Kelola informasi bencana dengan cepat dan tepat.
      </motion.p>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-4 mt-5">
        {Card('Lapor Bencana', 'Laporkan kejadian bencana secara akurat dan cepat.', '/report', '/image/ic_send_article.svg')}
        {Card('Peta Bencana', 'Informasi lokasi bencana secara real-time.', '/maps', '/image/ic_map.svg')}
        {Card('Berita & Edukasi', 'Dapatkan informasi dan edukasi seputar bencana.', '/articles', '/image/ic_article.svg')}
        {Card('Layanan', 'Akses layanan dan bantuan terkait bencana.', '/contact', '/image/ic_people.svg')}
      </div>

      {/* Galeri Bencana */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-xl font-bold mb-4">Galeri Bencana</h2>
        <div className="grid grid-cols-3 gap-4">
          {galleryImages.slice(0, 3).map((url, index) => (
            <motion.img
              key={index}
              src={url}
              alt={`galeri-${index}`}
              className="w-full h-48 object-cover rounded-lg shadow"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Artikel Terbaru */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Artikel Terbaru</h2>
          <button
            onClick={() => navigate("/articles")}
            className="text-blue-500 hover:underline text-sm"
          >
            Lihat Semua
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {showArticles.map((article, index) => (
            <motion.div
              key={index}
              onClick={() => navigate(`/detailarticles/${article.id}`)}
              className="bg-white shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <img
                src={article.image_url || "https://picsum.photos/seed/default/600/300"}
                alt={article.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold mb-2">{article.title}</h4>
                <p className="text-sm text-gray-600">{article.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
