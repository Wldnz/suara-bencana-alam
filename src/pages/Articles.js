import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ENV from '../Model/env';
const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [disasterType, setDisasterType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${ENV.getAPI_URL()}/articles`)
      .then((res) => res.json())
      .then((data) => {
        const fetched = data.data || [];
        setArticles(fetched);
        setFilteredArticles(fetched);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching articles:', err);
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const filtered = articles.filter((article) => {
        const matchRegion = search
          ? article.location?.toLowerCase().includes(search.toLowerCase())
          : true;
        const matchType = disasterType
          ? article.tag?.toLowerCase().includes(disasterType.toLowerCase())
          : true;
        return matchRegion && matchType;
      });

      setFilteredArticles(filtered);
      setIsLoading(false);
    }, 500);
  };

  return (
    <main className="flex-1 p-10">
      <h2 className="text-2xl font-bold">Artikel</h2>

      <form onSubmit={handleSubmit} className="mt-5 flex space-x-2 flex-wrap">
        <input
          type="text"
          placeholder="Cari Wilayah..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-2 border rounded-lg"
        />
        <select
          className="p-2 border rounded-lg"
          value={disasterType}
          onChange={(e) => setDisasterType(e.target.value)}
        >
          <option value="">Pilih Jenis Bencana</option>
          <option value="banjir">Banjir</option>
          <option value="tanah longsor">Tanah Longsor</option>
          <option value="gempa">Gempa Bumi</option>
          <option value="gunung">Gunung Meletus</option>
        </select>
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          Cari
        </button>
      </form>

      <div className="mt-5">
        {isLoading ? (
          <p className="text-gray-500">Memuat data artikel...</p>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((a) => (
              <Link to={`/articles/${a.id}`} key={a.id}>
                <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition">
                  <img
                    src={a.image_url}
                    alt={a.title}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <h3 className="mt-3 font-semibold text-blue-600 hover:underline">{a.title}</h3>
                  <p className="text-sm text-gray-600">
                    {a.content?.slice(0, 100)}...
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {a.createdAt?.split('T')[0]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Tidak ada artikel ditemukan.</p>
        )}
      </div>
    </main>
  );
};

export default Articles;
