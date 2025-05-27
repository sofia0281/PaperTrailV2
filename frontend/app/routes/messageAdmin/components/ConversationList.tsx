'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

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
        const visto = msg.visto;

        return {
          id: msg.id,
          contenido: msg.contenido,
          visto,
          user: user && user.id && user.username
            ? {
                id: user.id,
                username: user.username,
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

  return (
    <div className="p-4  border-r overflow-y">
      <h2 className="text-lg font-semibold mb-4">Conversaciones</h2>
      {usuarios.map((user) => {
        const bgColor = user.noVisto ? 'bg-red-100' : 'bg-green-100';
        return (
          <div
            key={user.id}
            className={`cursor-pointer p-2 rounded flex justify-between items-center hover:bg-gray-200 ${bgColor}`}
            onClick={() => onSelectUser(user.id, user.username)}
          >
            <span>{user.username}</span>
          </div>
        );
      })}
    </div>
  );
}
