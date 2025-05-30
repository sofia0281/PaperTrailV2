'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { em } from 'framer-motion/client';

export default function ConversationList({
  onSelectUser,
}: {
  onSelectUser: (id: number, username: string) => void;
}) {
  const [usuarios, setUsuarios] = useState<any[]>([]);

  const fetchUsuariosConMensajes = async () => {
    try {
      const res = await axios.get('http://localhost:1337/api/mensajes?populate=user');
      const mensajes = res.data.data.map((msg: any) => {
        const user = msg.user;
        const email = user.email;
        const visto = msg.visto;

        console.log('Email:', email);
        return {
          id: msg.id,
          contenido: msg.contenido,
          visto,
          email,
          user: user && user.id && user.username
            ? {
                id: user.id,
                username: user.username,
                email: user.email,
              }
            : null,
         
        };
      });

      const mapaUsuarios = new Map();

      mensajes.forEach((msg) => {
        const user = msg.user;
        const visto = msg.visto;

        if (user && user.id && user.username) {
          if (!mapaUsuarios.has(user.id)) {
            mapaUsuarios.set(user.id, {
              id: user.id,
              username: user.username,
              noVisto: !visto,
              email: user.email,
            });
          } else if (!visto) {
            mapaUsuarios.get(user.id).noVisto = true;
          }
        }
      });

      const listaUsuarios = Array.from(mapaUsuarios.values());
      setUsuarios(listaUsuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsuariosConMensajes();

    const intervalId = setInterval(fetchUsuariosConMensajes, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Contador de nuevos mensajes
  const nuevosMensajesCount = usuarios.filter((u) => u.noVisto).length;

  // Ordenar usuarios: primero los que tienen mensajes no vistos
  const usuariosOrdenados = [...usuarios].sort((a, b) => {
    if (a.noVisto === b.noVisto) return 0;
    return a.noVisto ? -1 : 1;
  });

  return (
    <div className="p-4 border-r overflow-y">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Conversaciones</h2>
        {nuevosMensajesCount > 0 && (
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {nuevosMensajesCount}
          </span>
        )}
      </div>

      {usuariosOrdenados.map((user) => {
        const bgColor = user.noVisto ? 'bg-orange-300' : 'bg-blue-300';
        return (
          <div
            key={user.id}
            className={`cursor-pointer p-2 rounded flex justify-between items-center hover:bg-red-100 ${bgColor}`}
            onClick={() => onSelectUser(user.id, user.username)}
          >
            <div className="flex flex-col">
        <span className="font-medium">{user.username}</span>
        <span className="text-xs text-gray-700">{user.email}</span>

      </div>

          </div>
        );
      })}
    </div>
  );
}
