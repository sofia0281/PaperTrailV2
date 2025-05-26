// components/ChatWindow.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ChatWindow({
    userId,
    username,
  }: {
    userId: number;
    username: string;
  }) {
    const [mensajes, setMensajes] = useState<any[]>([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
  
    useEffect(() => {
      const fetchMensajes = async () => {
        try {
          const res = await axios.get(`http://localhost:1337/api/mensajes?filters[user][id]=${userId}`);
          setMensajes(res.data.data);
        } catch (error) {
          console.error('Error cargando mensajes:', error);
        }
      };
  
      fetchMensajes();
      const interval = setInterval(fetchMensajes, 3000);
      return () => clearInterval(interval);
    }, [userId]);
  
    const handleSend = async () => {
      try {
        const ultimoMensaje = mensajes[mensajes.length - 1];
        if (!ultimoMensaje) {
          console.warn('No hay mensaje para responder');
          return;
        }
  
        await axios.post('http://localhost:1337/api/respuestas', {
            data: {
              contenido: nuevoMensaje,
              es_admin: true,
              mensaje: ultimoMensaje.documentId,
            },
          });
          
        setNuevoMensaje('');
      } catch (error) {
        console.error('Error al enviar respuesta:', error);
      }
    };
  
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b font-semibold">Chat con {username}</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {mensajes.map((msg) => (
            <div key={msg.id} className="p-2 bg-white rounded shadow text-sm">
              {msg.contenido}
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex">
          <input
            type="text"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            className="flex-1 border rounded p-2 mr-2"
            placeholder="Escribe tu mensaje..."
          />
          <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">
            Enviar
          </button>
        </div>
      </div>
    );
  }
  