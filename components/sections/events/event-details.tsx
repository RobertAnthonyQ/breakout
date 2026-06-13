import type { Event } from "./events.data";

interface EventDetailsProps {
  event: Event;
}

export default function EventDetails({ event }: EventDetailsProps) {
  return (
    <>
      {/* Título y descripción */}
      <div>
        <h3
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 uppercase"
          style={{
            color: "#1a1a1a",
            letterSpacing: "-0.03em",
            lineHeight: "0.95",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {event.title}
        </h3>
        <p
          className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed font-light"
          style={{ letterSpacing: "-0.01em" }}
        >
          {event.description}
        </p>
      </div>

      {/* Detalles del evento - Diseño elegante */}
      <div className="space-y-6 mt-10">
        {/* Fecha */}
        <div className="flex items-start gap-5">
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "#214fdd" }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
              FECHA
            </p>
            <p
              className="text-xl sm:text-2xl font-black tracking-tight"
              style={{
                color: "#1a1a1a",
                letterSpacing: "-0.02em",
              }}
            >
              {event.date}
            </p>
          </div>
        </div>

        {/* Hora */}
        <div className="flex items-start gap-5">
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "#214fdd" }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
              HORARIO
            </p>
            <p
              className="text-xl sm:text-2xl font-black tracking-tight"
              style={{
                color: "#1a1a1a",
                letterSpacing: "-0.02em",
              }}
            >
              {event.time}
            </p>
          </div>
        </div>

        {/* Ubicación */}
        <div className="flex items-start gap-5">
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "#214fdd" }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
              UBICACIÓN
            </p>
            <p
              className="text-xl sm:text-2xl font-black tracking-tight"
              style={{
                color: "#1a1a1a",
                letterSpacing: "-0.02em",
              }}
            >
              {event.location?.name || "Open PUCP"}
            </p>
            <p className="text-base text-gray-600 mt-1 font-light">
              {event.location?.address || "Lima, Perú"}
            </p>
          </div>
        </div>
      </div>

      {/* Mapa pequeño - Esquinas más redondeadas */}
      {event.location && (
        <div
          className="rounded-3xl overflow-hidden shadow-md"
          style={{ border: "1px solid rgba(0, 0, 0, 0.06)" }}
        >
          <iframe
            src={`https://www.google.com/maps?q=${event.location.coordinates.lat},${event.location.coordinates.lng}&hl=es&z=17&output=embed`}
            width="100%"
            height="220"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación del evento"
          ></iframe>
        </div>
      )}

      {/* Organizadores - Elegante */}
      <div className="flex items-center gap-5 pt-8 mt-8 border-t-2 border-gray-200">
        <div className="flex-shrink-0">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg"
            style={{
              backgroundColor: "#214fdd",
              letterSpacing: "-0.02em",
            }}
          >
            B
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
            ORGANIZADO POR
          </p>
          <p
            className="font-black text-xl tracking-tight"
            style={{
              color: "#1a1a1a",
              letterSpacing: "-0.02em",
            }}
          >
            Breakout Community
          </p>
          <p className="text-base text-gray-500 font-light mt-0.5">
            500+ miembros activos
          </p>
        </div>
      </div>
    </>
  );
}
