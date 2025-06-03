'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);

  // Función optimizada para cargar mensajes
  const fetchMensajes = useCallback(async () => {
    if (!authUser?.id || isBanned) return;
    
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mensajes?filters[user][id]=${authUser.id}&populate[respuestas][populate]=user`
      );
      setMensajes(res.data.data);
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [authUser, isBanned]);

  // Verificar estado de baneo y cargar mensajes en paralelo
  useEffect(() => {
    if (!authUser?.id) return;

    const checkBanStatus = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${authUser.id}`);
        setIsBanned(res.data.baneo);
        if (res.data.baneo) {
          setShowBanModal(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error verificando estado de baneo:', error);
        setIsLoading(false);
      }
    };

    // Ejecutar ambas operaciones en paralelo
    Promise.all([checkBanStatus(), fetchMensajes()]);

    // Configurar polling cada 3 segundos
    const interval = setInterval(fetchMensajes, 3000);

    return () => clearInterval(interval);
  }, [authUser, fetchMensajes]);

  // Resto del código permanece igual...
  const checkMessageLimit = () => {
    if (mensajes.length === 0) return true;

    let consecutiveCount = 0;
    for (let i = mensajes.length - 1; i >= 0; i--) {
      const msg = mensajes[i];
      
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
      // Actualizar mensajes inmediatamente después de enviar
      await fetchMensajes();
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
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Cargando mensajes...</p>
              </div>
            ) : mensajes.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">No hay mensajes todavía.</p>
              </div>
            ) : (
              <>
                <div className="flex-1" />
                {mensajes.map((msg) => (
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
                ))}
              </>
            )}
          </div>

          {/* Resto del JSX permanece igual */}
          <div className="p-4 border-t bg-white flex gap-2 items-end relative">
            {/* ... */}
          </div>
        </div>
      </div>
    </>
  );
}