// app/routes/messageAdmin/page.tsx
'use client';

import { useState } from 'react';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';

export default function AdminChatLayout() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string>('');

  return (
    <div className="flex h-screen">
      {/* Lado izquierdo: lista de conversaciones */}
      <div className="w-1/3 border-r overflow-y-auto">
        <ConversationList
          onSelectUser={(id, username) => {
            setSelectedUserId(id);
            setSelectedUsername(username);
          }}
        />
      </div>

      {/* Lado derecho: ventana del chat */}
      <div className="w-2/3">
        {selectedUserId ? (
          <ChatWindow userId={selectedUserId} username={selectedUsername} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Selecciona una conversación
          </div>
        )}
      </div>
    </div>
  );
}
