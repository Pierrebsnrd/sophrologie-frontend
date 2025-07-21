import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Image src="logo.png" alt="Logo" width={50} height={50} />
        <h1 className="text-xl font-semibold text-gray-800">Cabinet de Sophrologie</h1>
      </div>
      <ul className="flex space-x-6 text-gray-700 font-medium">
        <li>
          <Link href="/">Accueil</Link>
        </li>
        <li>
          <Link href="/qui-suis-je">Qui suis-je ?</Link>
        </li>
        <li>
          <Link href="/tarifs">Tarifs</Link>
        </li>
        <li>
          <Link href="/rdv">Prendre rendez-vous</Link>
        </li>
        <li>
          <Link href="/offres-entreprise">Offres entreprise</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        <li>
          <Link href="/faq">FAQ</Link>
        </li>
      </ul>
    </nav>
  );
}
