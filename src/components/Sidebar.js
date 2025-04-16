import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Beranda' },
    { to: '/about', label: 'Tentang Kami' },
    { to: '/maps', label: 'Peta Bencana' },
    { to: '/articles', label: 'Berita & Edukasi' },
    { to: '/report', label: 'Laporan Bencana' },
    { to: '/account', label: 'Akun' },
    { to: '/contact', label: 'Kontak' },
  ];

  return (
    <>
      {/* Hamburger Menu (Mobile only) */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-3 fixed top-4 left-4 z-50 bg-white shadow-md rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className='w-64 h-dvh hidden md:block'></aside>
      <aside
        className={`bg-white font-poppins w-64 h-dvh min-dvh fixed top-0 left-0 z-40 p-5 shadow-xl transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:flex md:flex-col`}
      >
        {/* Logo / Branding */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-tr from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow">
            S
          </div>
          <span className="text-xl font-semibold text-gray-800">
            Suara Bencana
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2 w-full">
          {navItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block w-full py-3 px-5 rounded-lg text-base font-semibold transition-all duration-200 tracking-wide ${
                  isActive
                    ? 'bg-red-100 text-red-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-red-600 hover:scale-[1.02]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Backdrop (Mobile only) */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
