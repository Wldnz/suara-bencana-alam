import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ENV from "../Model/env";
import Api from "../Model/Api";

const DetailArticles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // auto scroll to top
    fetch(`${ENV.getAPI_URL()}/article/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const allArticles = data?.data || [];
        const found = allArticles.find((item) => String(item.id) === id);

        if (found) {
          setArticle(found);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setNotFound(true);
        setLoading(false);
      });
      Api().put(`article-views/${id}`);
  }, [id]);

  if (loading) return <p className="p-6 text-gray-500">Memuat artikel...</p>;
  if (notFound || !article)
    return (
      <p className="p-6 text-red-500 font-semibold text-lg">
        Artikel tidak ditemukan.
      </p>
    );

  return (
    <div className="p-6 space-y-4">
      {/* Tombol Kembali */}
      <button
    onClick={() => navigate(-1)}
    className="text-lg bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded"
    title="Kembali"
  >
    ←
  </button>

      <h1 className="text-3xl font-bold">{article.title}</h1>
      <p className="text-sm text-gray-400">
        {article.created_at}
      </p>
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full rounded-lg h-[400px] object-contain"
        />
      )}
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {article.content}
      </p>
    </div>
  );
};

export default DetailArticles;
