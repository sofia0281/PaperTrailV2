'use client';

import { useEffect, useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import CashCard from "../../ui/cashcard";
import AddCardModal from '@/components/Clientes_Admins/Wallet/AddCardModal';
import ConfirmModal from '@/components/Clientes_Admins/Wallet/ConfirmModal';
import EditCardModal from '@/components/Clientes_Admins/Wallet/EditCardModal';
import { useAuth } from '@/context/AuthContext';
import { getCardsByUser, deleteCard } from '@/services/cardCRUD';

const Wallet = () => {
  const [showModal, setShowModal] = useState(false);
  const [cards, setCards] = useState([]);
  const [deletingCardId, setDeletingCardId] = useState(null);
  const { authUser } = useAuth();

  const [showConfirm, setShowConfirm] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState(null);


  const fetchCards = async () => {
    if (!authUser?.id) return;
    try {
      const data = await getCardsByUser(authUser.id);
      setCards(data);
    } catch (error) {
      console.error("No se pudieron cargar las tarjetas");
    }
  };

  useEffect(() => {
    fetchCards();
  }, [authUser]);

  const handleCloseModal = () => {
    setShowModal(false);
    fetchCards();
  };

  const handleDeleteCard = (documentId) => {
    setCardToDelete(documentId);
    setShowConfirm(true);
  };
  
  const handleConfirmDelete = async () => {
    const documentId = cardToDelete;
    setShowConfirm(false);
    setDeletingCardId(documentId);
  
    setTimeout(async () => {
      try {
        await deleteCard(documentId);
        setCards(prev => prev.filter(card => card.documentId !== documentId));
        setDeletingCardId(null);
        setCardToDelete(null);
      } catch (error) {
        console.error("Error al eliminar tarjeta:", error.message);
        alert("No se pudo eliminar la tarjeta");
        setDeletingCardId(null);
        setCardToDelete(null);
      }
    }, 300);
  };
  
  const handleCancelDelete = () => {
    setShowConfirm(false);
    setCardToDelete(null);
  };

  const handleEditCard = (card) => {
    setCardToEdit(card);
    setEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setCardToEdit(null);
    fetchCards(); // recarga tarjetas después de editar
  };

  const totalMonto = cards.reduce((acc, card) => acc + (Number(card.Monto) || 0), 0);

  return (
    <div className="w-full bg-white shadow-lg overflow-hidden min-h-screen">
      {/* Encabezado */}
      <div className="relative bg-orange-600 text-white p-6 pb-16">
        <div className="flex items-center">
          <FaUserCircle className="text-6xl mr-3" />
          <div>
            <h2 className="text-xl font-bold">Hola,</h2>
            <h2 className="text-xl font-bold">{authUser?.username || "Usuario"}</h2>
          </div>
        </div>
        <div className="absolute top-6 right-6 text-right">
          <h3 className="text-lg">Monedero</h3>
          <p className="text-2xl font-bold">
            ${totalMonto.toLocaleString('es-CO')}
          </p>
        </div>
      </div>

      {/* Lista de tarjetas */}
      <div className="w-full flex flex-wrap items-start px-6 gap-6 py-6 justify-center lg:justify-start">
        {cards.length === 0 ? (
          <p className="text-gray-500">No tienes tarjetas registradas.</p>
        ) : (
          cards.map((card) => (
            <div
              key={card.documentId}
              className={`transition-all duration-300 ease-in-out ${deletingCardId === card.documentId ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
              <CashCard
                numero={card.Numero}
                banco={card.Banco}
                tipo={card.Tipo}
                titular={card.Titular}
                vencimiento={card.FechaVencimiento}
                monto={card.Monto}
                onDelete={() => handleDeleteCard(card.documentId)}
                onEdit={() => handleEditCard(card)}
              />
            </div>
          ))
        )}
      </div>

      {/* Botón agregar tarjeta */}
      <div className="px-6 pb-6 flex justify-end">
        <button
          className="bg-orange-600 text-white px-6 py-2 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          Agregar Tarjeta
        </button>
      </div>

      <AddCardModal isOpen={showModal} onClose={handleCloseModal} />
      <ConfirmModal
      isOpen={showConfirm}
      onConfirm={handleConfirmDelete}
      onCancel={handleCancelDelete}
    />
    {editModalOpen && cardToEdit && (
  <EditCardModal
    isOpen={editModalOpen}
    onClose={handleCloseEditModal}
    cardToEdit={cardToEdit}
  />
)}


    </div>
    
  );
};

export default Wallet;
