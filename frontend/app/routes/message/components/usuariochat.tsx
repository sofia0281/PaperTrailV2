'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { SendHorizonal } from 'lucide-react';

export default function UsuarioChat() {
  const { authUser } = useAuth();
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    if (!authUser?.id) return;

    const fetchMensajes = async () => {
      try {
        const res = await axios.get(
          `http://localhost:1337/api/mensajes?filters[user][id]=${authUser.id}&populate[respuestas][populate]=user`

        );
        setMensajes(res.data.data);
      } catch (error) {
        console.error('Error al obtener mensajes:', error);
      }
    };

    fetchMensajes();
    const interval = setInterval(fetchMensajes, 3000);

    return () => clearInterval(interval);
  }, [authUser]);

  const enviarMensaje = async () => {
    if (!authUser?.id || !mensaje.trim()) return;

    try {
      await axios.post('http://localhost:1337/api/mensajes', {
        data: {
          contenido: mensaje,
          user: authUser.id,
        },
      });
      setMensaje('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Soporte al Cliente</h2>

      <div className="bg-white border rounded-lg p-4 shadow-sm min-h-[300px] mb-4 overflow-y-auto max-h-[500px]">
        {mensajes.length === 0 ? (
          <p className="text-gray-500 text-center">No hay mensajes todavía.</p>
        ) : (
          mensajes.map((msg) => (
            <div key={msg.id} className="mb-6">
              <div className="bg-green-100 p-3 rounded-lg text-sm text-gray-800 max-w-[80%] ml-auto">
                <span className="font-semibold">Tú:</span> {msg.contenido}
              </div>

              {(msg.respuestas || []).map((res) => (
              <div
                key={res.id}
                className="bg-blue-100 p-3 rounded-lg text-sm text-gray-800 mt-2 max-w-[80%] relative"
              >
                <div className="text-[10px] text-gray-500 mb-1 font-medium">
                  {res.user?.username || 'Admin'}
                </div>
                {res.contenido}
              </div>
            ))}


            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={enviarMensaje}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <SendHorizonal size={16} />
          Enviar
        </button>
      </div>
    </div>
  );
}
