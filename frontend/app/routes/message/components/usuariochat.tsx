// components/UsuarioChat.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { SendHorizonal } from 'lucide-react';
import BannedModal from './BannedModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function UsuarioChat() {
  const { authUser } = useAuth();
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [isBanned, setIsBanned] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showBanMessage, setShowBanMessage] = useState(false);
  const [showLimitMessage, setShowLimitMessage] = useState(false);

  // Verificar estado de baneo
  useEffect(() => {
    if (!authUser?.id) return;

    const checkBanStatus = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${authUser.id}`);
        setIsBanned(res.data.baneo);
        if (res.data.baneo) {
          setShowBanModal(true);
        }
      } catch (error) {
        console.error('Error verificando estado de baneo:', error);
      }
    };

    checkBanStatus();
  }, [authUser]);

  useEffect(() => {
    if (!authUser?.id || isBanned) return;

    const fetchMensajes = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mensajes?filters[user][id]=${authUser.id}&populate[respuestas][populate]=user`
        );
        setMensajes(res.data.data);
      } catch (error) {
        console.error('Error al obtener mensajes:', error);
      }
    };

    fetchMensajes();
    const interval = setInterval(fetchMensajes, 3000);

    return () => clearInterval(interval);
  }, [authUser, isBanned]);

  const checkMessageLimit = () => {
    if (mensajes.length === 0) return true;

    // Contar mensajes consecutivos del usuario sin respuesta
    let consecutiveCount = 0;
    for (let i = mensajes.length - 1; i >= 0; i--) {
      const msg = mensajes[i];
      
      // Si encontramos una respuesta del admin, rompemos el ciclo
      if (msg.respuestas && msg.respuestas.length > 0) {
        break;
      }
      
      consecutiveCount++;
      
      if (consecutiveCount >= 5) {
        return false;
      }
    }
    
    return true;
  };

  const enviarMensaje = async () => {
    if (!authUser?.id || !mensaje.trim() || isBanned) {
      if (isBanned) {
        setShowBanMessage(true);
        setTimeout(() => setShowBanMessage(false), 3000);
      }
      return;
    }

    // Verificar límite de mensajes
    if (!checkMessageLimit()) {
      setShowLimitMessage(true);
      setTimeout(() => setShowLimitMessage(false), 3000);
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mensajes`, {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      enviarMensaje();
    }
  };

  return (
    <>
      <BannedModal 
        isOpen={showBanModal} 
        onClose={() => setShowBanModal(false)} 
        emailContacto="contacto@papertrail.com"
      />

      <div className="flex flex-col h-full max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Soporte al Cliente</h2>

        <div className="flex flex-col h-full border rounded-lg shadow bg-white">
          <div className="p-4 border-b">
            <span className="font-semibold">Chat con Soporte</span>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto px-4 py-2 bg-gray-50 min-h-[70vh]">
            <div className="flex-1" />
            
            {mensajes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay mensajes todavía.</p>
            ) : (
              mensajes.map((msg) => (
                <div key={msg.id} className="mt-2">
                  <motion.div
                    className="bg-orange-300 p-3 rounded-lg text-sm text-gray-800 max-w-[80%] ml-auto mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-[10px] text-gray-600 mb-1 font-medium">
                      Tú
                    </div>
                    {msg.contenido}
                  </motion.div>

                  <AnimatePresence>
                    {(msg.respuestas || []).map((res: any) => (
                      <motion.div
                        key={res.id}
                        className="bg-blue-300 p-3 rounded-lg text-sm text-gray-800 mt-2 max-w-[80%]"
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
            {showBanMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full mb-2 left-0 w-full px-4"
              >
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                  No puedes enviar mensajes porque tu cuenta está bloqueada
                </div>
              </motion.div>
            )}

            {showLimitMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full mb-2 left-0 w-full px-4"
              >
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded text-sm">
                  Has alcanzado el límite de 5 mensajes seguidos. Espera una respuesta del administrador.
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
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full border rounded p-2 transition-all duration-300 ${
                  isBanned ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder={
                  isBanned 
                    ? 'Cuenta bloqueada - no puedes enviar mensajes' 
                    : 'Escribe tu mensaje...'
                }
                disabled={isBanned}
              />
            </motion.div>

            <AnimatePresence mode="wait">
              {mensaje.trim().length > 0 && !isBanned && checkMessageLimit() && (
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
                    onClick={enviarMensaje}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                  >
                    <SendHorizonal size={20} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}