'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ConversationList({
  onSelectUser,
}: {
  onSelectUser: (id: number, username: string) => void;
}) {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsuariosConMensajes = async () => {
    try {
      const res = await axios.get('http://localhost:1337/api/mensajes?populate=user');
      const mensajes = res.data.data;

      const mapaUsuarios = new Map();

      mensajes.forEach((msg: any) => {
        const user = msg.user;
        const visto = msg.visto;

        if (user && user.id && user.username) {
          if (!mapaUsuarios.has(user.id)) {
            mapaUsuarios.set(user.id, {
              id: user.id,
              username: user.username,
              email: user.email,
              baneo: user.baneo,
              noVisto: !visto,
              mensajesNoVistos: !visto ? 1 : 0,
            });
          } else {
            const data = mapaUsuarios.get(user.id);
            if (!visto) {
              data.noVisto = true;
              data.mensajesNoVistos += 1;
            }
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

  const nuevosMensajesCount = usuarios.filter((u) => u.noVisto).length;

  const usuariosOrdenados = [...usuarios].sort((a, b) => {
    if (a.noVisto === b.noVisto) return 0;
    return a.noVisto ? -1 : 1;
  });

  const usuariosFiltrados = usuariosOrdenados.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <input
        type="text"
        placeholder="Buscar usuario..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full p-2 border rounded"
      />

      {usuariosFiltrados.map((user) => {
        const bgColor = user.baneo
          ? 'bg-red-300'
          : user.noVisto
          ? 'bg-orange-300'
          : 'bg-blue-300';

        return (
          <div
            key={user.id}
            className={`cursor-pointer p-2 rounded flex justify-between items-center hover:bg-red-100 ${bgColor}`}
            onClick={() => onSelectUser(user.id, user.username)}
          >
            <div className="flex flex-col">
              <span className="font-medium text-black">{user.username}</span>
              <span className="text-xs text-gray-700">{user.email}</span>
            </div>
            {user.mensajesNoVistos > 0 && (
              <div className="ml-2 bg-orange-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                {user.mensajesNoVistos}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
