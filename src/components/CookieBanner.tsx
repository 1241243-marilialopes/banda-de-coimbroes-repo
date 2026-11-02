'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookies_accepted');
    if (!accepted) {
      setShow(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem('cookies_accepted', 'true');
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md z-40 bg-neutral-900/95 text-white p-4 rounded-xl shadow-2xl border border-neutral-700 flex flex-col sm:flex-row items-center gap-4 transition-all">
      <p className="text-sm text-gray-300">
        Este site utiliza cookies para que obtenha uma melhor experiência de navegação.
      </p>
      <button
        onClick={handleAccept}
        className="whitespace-nowrap px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-sm rounded shadow transition"
      >
        Ok
      </button>
    </div>
  );
}

