import React from "react";

const AboutUs = () => {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold mb-4">Tentang Kami</h1>
      <div className="bg-white p-6 rounded shadow-md text-gray-700">
        <p className="mb-4">
          Kami adalah tim yang berdedikasi untuk memberikan informasi bencana
          secara real-time kepada masyarakat Indonesia. Dengan menggunakan teknologi
          terkini, kami berharap dapat membantu meningkatkan kewaspadaan dan
          mempercepat respon dalam situasi darurat.
        </p>
        <p className="mb-4">
          Layanan kami menyediakan pelaporan bencana seperti banjir, gempa bumi,
          tsunami, hingga gunung meletus, yang dapat diakses oleh siapa saja,
          kapan saja.
        </p>
        <p>
          Visi kami adalah menciptakan masyarakat yang lebih tanggap dan siap
          menghadapi bencana.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
