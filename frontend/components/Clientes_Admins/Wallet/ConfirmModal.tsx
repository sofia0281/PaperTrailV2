'use client';

const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/5 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">¿Estás seguro?</h2>
        <p className="text-sm text-gray-600 mb-6">Esta acción eliminará la tarjeta de tu monedero.</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-orange-600 text-orange-600 hover:bg-orange-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
