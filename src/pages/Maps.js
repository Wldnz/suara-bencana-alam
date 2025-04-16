import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ENV from '../Model/env';

function Maps() {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const [searchInput, setSearchInput] = useState('');
  const [disasterType, setDisasterType] = useState('');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res1 = await fetch(`${ENV.getAPI_URL()}/locations`);
        const data = await res1.json();
        setLocations(data?.data || []);
      } catch (error) {
        console.error('Gagal ambil data lokasi:', error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    leafletMap.current = L.map(mapRef.current).setView([-2.5, 117], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(leafletMap.current);
  }, []);

  const getColor = (type) => {
    const colors = {
      'Banjir': 'blue',
      'Gempa': 'red',
      'Tanah Longsor': 'yellow',
      'Gunung Meletus': 'orange',
      'Kebakaran Hutan': 'green',
      'Tsunami': 'purple',
      'Puting Beliung': 'brown',
    };
    return colors[type] || 'gray';
  };

  const clearMap = () => {
    leafletMap.current.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker || layer instanceof L.Marker) {
        leafletMap.current.removeLayer(layer);
      }
    });
  };

  const handleSearch = () => {
    if (!searchInput && !disasterType) return;

    clearMap();

    const filtered = locations.filter((loc) => {
      const cocokWilayah = searchInput
        ? loc.city?.toLowerCase().includes(searchInput.toLowerCase()) ||
          loc.provinci?.toLowerCase().includes(searchInput.toLowerCase())
        : true;

      const cocokBencana = disasterType ? loc.type === disasterType : true;
      const validKoordinat = loc.latitude !== 0 && loc.longitude !== 0;

      return cocokWilayah && cocokBencana && validKoordinat;
    });

    if (filtered.length === 0) {
      alert('Tidak ada lokasi yang cocok dengan pencarian!');
      return;
    }

    filtered.forEach((loc) => {
      const color = getColor(loc.tipe);
      L.circleMarker([loc.latitude, loc.longitude], {
        radius: 8,
        fillColor: color,
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .addTo(leafletMap.current)
        .bindPopup(`<strong>${loc.tipe}</strong><br/>${loc.kota}, ${loc.provinsi}`);
    });

    leafletMap.current.setView([filtered[0].latitude, filtered[0].longitude], 10);
  };

  return (
    <main className="flex-1 p-6">
      <h2 className="text-2xl font-bold mb-2">Peta Bencana</h2>
      <p className="text-gray-600 mb-5">Lihat lokasi bencana berdasarkan pencarian wilayah dan jenis bencana.</p>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Cari provinsi/kota..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="md:w-1/3 p-2 border rounded-lg"
        />
        <select
          className="md:w-1/3 p-2 border rounded-lg"
          value={disasterType}
          onChange={(e) => setDisasterType(e.target.value)}
        >
          <option value="">Pilih Jenis Bencana</option>
          <option value="Banjir">Banjir</option>
          <option value="Tanah Longsor">Tanah Longsor</option>
          <option value="Gempa">Gempa</option>
          <option value="Gunung Meletus">Gunung Meletus</option>
          <option value="Kebakaran Hutan">Kebakaran Hutan</option>
          <option value="Tsunami">Tsunami</option>
          <option value="Puting Beliung">Puting Beliung</option>
        </select>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Cari
        </button>
      </div>

      <div id="map" ref={mapRef} className="h-[450px] w-full border rounded-lg shadow"></div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Keterangan:</h3>
        <ul className="text-sm space-y-1">
          <li><span className="w-4 h-4 bg-blue-500 inline-block mr-2 rounded"></span> Banjir</li>
          <li><span className="w-4 h-4 bg-yellow-500 inline-block mr-2 rounded"></span> Tanah Longsor</li>
          <li><span className="w-4 h-4 bg-red-500 inline-block mr-2 rounded"></span> Gempa</li>
          <li><span className="w-4 h-4 bg-orange-500 inline-block mr-2 rounded"></span> Gunung Meletus</li>
          <li><span className="w-4 h-4 bg-green-500 inline-block mr-2 rounded"></span> Kebakaran Hutan</li>
          <li><span className="w-4 h-4 bg-purple-500 inline-block mr-2 rounded"></span> Tsunami</li>
          <li><span className="w-4 h-4 bg-yellow-800 inline-block mr-2 rounded"></span> Puting Beliung</li>
        </ul>
      </div>
    </main>
  );
}

export default Maps;
