'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWindow({
  userId,
  username,
}: {
  userId: number;
  username: string;
}) {
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const { authUser } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const justSentRef = useRef(false);

  const marcarMensajesComoVistos = async (mensajes: any[]) => {
    const noVistos = mensajes.filter((msg) => msg.visto === false);
    await Promise.all(
      noVistos.map((msg) =>
        axios.put(`http://localhost:1337/api/mensajes/${msg.documentId}`, {
          data: { visto: true },
        })
      )
    );
  };

  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const res = await axios.get(
          `http://localhost:1337/api/mensajes?filters[user][id]=${userId}&populate=respuestas`
        );
        const mensajes = res.data.data;
        setMensajes(mensajes);

        if (mensajes.some((msg) => msg.visto === false)) {
          await marcarMensajesComoVistos(mensajes);
        }

        if (justSentRef.current) {
          setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            justSentRef.current = false;
          }, 100);
        }
      } catch (error) {
        console.error('Error cargando mensajes:', error);
      }
    };

    fetchMensajes();
    const interval = setInterval(fetchMensajes, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [userId]);

  const handleSend = async () => {
    if (!nuevoMensaje.trim()) return;
    if (!authUser || !authUser.id) {
      console.warn('Esperando a que authUser esté disponible...');
      return;
    }

    try {
      const ultimoMensaje = mensajes[mensajes.length - 1];
      if (!ultimoMensaje) return;

      await axios.post('http://localhost:1337/api/respuestas', {
        data: {
          contenido: nuevoMensaje,
          es_admin: true,
          mensaje: ultimoMensaje.documentId,
          user: authUser.id,
        },
      });

      setNuevoMensaje('');
      justSentRef.current = true;
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
    }
  };

  if (!authUser) {
    return (
      <div className="p-4 text-center text-gray-500">
        Cargando información del usuario...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border rounded shadow bg-white">
      <div className="p-4 border-b font-semibold">Chat con {username}</div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 bg-gray-50">
        {mensajes.length === 0 ? (
          <p className="text-gray-500 text-center">No hay mensajes aún.</p>
        ) : (
          mensajes.map((msg) => (
            <div key={msg.id}>
              <motion.div
                className="bg-green-100 p-3 rounded-lg text-sm text-gray-800 max-w-[80%]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="font-semibold">Usuario:</span> {msg.contenido}
              </motion.div>

              <AnimatePresence>
                {(msg.respuestas || []).map((res: any) => (
                  <motion.div
                    key={res.id}
                    className="bg-blue-100 p-3 rounded-lg text-sm text-gray-800 mt-2 ml-auto max-w-[80%]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-semibold">Admin:</span> {res.contenido}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t bg-white flex gap-2">
        <input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Escribe tu mensaje..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={!authUser}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
