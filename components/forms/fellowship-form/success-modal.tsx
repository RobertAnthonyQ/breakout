"use client";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[var(--bo-cobalt)]/80"
        onClick={onClose}
      />

      {/* Contenido del modal */}
      <div className="relative bg-white border border-[var(--bo-line)] rounded-2xl p-6 sm:p-8 md:p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Icono de éxito */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--bo-cobalt-50)] flex items-center justify-center border-2 border-[var(--bo-cobalt)]/30 animate-in zoom-in duration-500">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--bo-cobalt)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl sm:text-3xl font-display text-center text-[var(--bo-cobalt)] mb-4">
          ¡Aplicación Enviada!
        </h2>

        {/* Mensaje */}
        <p className="text-[var(--bo-text)] text-center text-base sm:text-lg leading-relaxed mb-8">
          Tu aplicación al Fellowship ha sido enviada exitosamente. Revisaremos
          tu perfil y nos pondremos en contacto pronto.
        </p>

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="w-full bg-[var(--bo-cobalt)] hover:bg-[var(--bo-cobalt-700)] text-white font-bold py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          style={{
            boxShadow: "0 4px 20px rgba(33, 79, 221, 0.4)",
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
