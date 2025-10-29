import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Home</h1>
      <p className="mb-4">Navega al editor usando un botón dentro del lienzo o este enlace.</p>
      <Link className="text-blue-600 underline" to="/editor">Ir al Editor</Link>
    </div>
  );
}
