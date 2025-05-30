'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizonal } from 'lucide-react';
import { Settings } from "lucide-react";

export default function ChatWindow({
  userId,
  username,
}: {
  userId: number;
  username: string;
}) {
  const [isBanned, setIsBanned] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const { authUser } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const justSentRef = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showBanMessage, setShowBanMessage] = useState(false);

  // Cierra el menú si haces clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:1337/api/users/${userId}`);
        setIsBanned(res.data.baneo);
      } catch (error) {
        console.error('Error obteniendo estado del usuario:', error);
      }
    };
    fetchUserStatus();
  }, [userId]);

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
          `http://localhost:1337/api/mensajes?filters[user][id]=${userId}&populate[respuestas][populate]=user`
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
    if (isBanned) {
      setShowBanMessage(true);
      setTimeout(() => setShowBanMessage(false), 3000);
      return;
    }

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
      <div className="p-4 border-b flex items-center justify-between">
        <span className="font-semibold">Chat con {username}</span>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded hover:bg-gray-200 transition"
          >
            <Settings size={20} />
          </button>
  
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
              <button
                onClick={async () => {
                  try {
                    await axios.put(`http://localhost:1337/api/users/${userId}`, {
                      baneo: !isBanned,
                    });
                    setIsBanned(!isBanned);
                    setShowMenu(false);
                  } catch (error) {
                    console.error("Error al cambiar baneo:", error);
                  }
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {isBanned ? "Desbloquear" : "Bloquear Usuario"}
              </button>
            </div>
          )}
        </div>
      </div>
  
      {/* Área de mensajes modificada */}
      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-2 bg-gray-50">
        {/* Espacio flexible que empuja los mensajes hacia abajo */}
        <div className="flex-1" />
        
        {mensajes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay mensajes aún.</p>
        ) : (
          mensajes.map((msg) => (
            <div key={msg.id} className="mt-2">
              <motion.div
                className="bg-orange-300 p-3 rounded-lg text-sm text-gray-800 max-w-[80%]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-[10px] text-gray-600 mb-1 font-medium">
                  {username}
                </div>
                {msg.contenido}
              </motion.div>
  
              <AnimatePresence>
                {(msg.respuestas || []).map((res: any) => (
                  <motion.div
                    key={res.id}
                    className="bg-blue-300 p-3 rounded-lg text-sm text-gray-800 mt-2 ml-auto max-w-[80%]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-[10px] text-gray-600 font-medium mb-1">
                      {res.user?.username || 'Admin'}
                    </div>
                    {res.contenido}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
  
      <div className="p-4 border-t bg-white flex gap-2 items-end relative">
        {isBanned && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full mb-2 left-0 w-full px-4"
          >
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
              No puedes enviar mensajes a {username} porque está bloqueado
            </div>
          </motion.div>
        )}
  
        {showBanMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 left-0 w-full px-4"
          >
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
              No puedes enviar mensajes a {username} porque está bloqueado
            </div>
          </motion.div>
        )}
  
        <motion.div
          layout
          transition={{ duration: 0.3, type: "spring" }}
          className="flex-1"
        >
          <input
            type="text"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full border rounded p-2 transition-all duration-300 ${
              isBanned ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder={
              isBanned 
                ? `Usuario bloqueado - no puedes enviar mensajes` 
                : 'Escribe tu mensaje...'
            }
            disabled={isBanned}
          />
        </motion.div>
  
        <AnimatePresence mode="wait">
          {nuevoMensaje.trim().length > 0 && !isBanned && (
            <motion.div
              key="send-button"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="origin-bottom"
            >
              <button
                onClick={handleSend}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-blue-400"
              >
                <SendHorizonal size={25} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}