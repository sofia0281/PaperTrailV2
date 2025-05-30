// components/BannedModal.tsx
'use client';

import { useRouter } from 'next/navigation';

interface BannedModalProps {
  isOpen: boolean;
  emailContacto?: string;
}

export default function BannedModal({ 
  isOpen, 
  emailContacto = "contacto@papertrail.com" 
}: BannedModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleRedirect = () => {
    router.push('/'); // Redirige a la página de inicio
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Cuenta Bloqueada
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-4">
              Tu cuenta ha sido suspendida por violar nuestros términos de servicio.
              Para más información o apelar esta decisión, por favor contacta a:
            </p>
            <a
              href={`mailto:${emailContacto}`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {emailContacto}
            </a>
          </div>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={handleRedirect}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}