export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image: string;
  tags: string[];
  isPast: boolean;
  registrationLink?: string;
  location?: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

export const mainEvent: Event = {
  id: "main",
  title: "INNOVACIÓN 3.0",
  description:
    "Te invitamos a un panel exclusivo donde exploraremos cómo se teje el futuro de la innovación en Latinoamérica 🌎 desde tres frentes complementarios",
  date: "19 de Noviembre, 2025",
  time: "1 PM",
  image: "/images/events/evento-19-nov-25.png",
  tags: ["Innovación", "Latinoamérica", "Panel"],
  isPast: false,
  registrationLink: "/form",
  location: {
    name: "Pontificia Universidad Católica del Perú",
    address: "Av. Universitaria 1801, San Miguel 15088, Peru - Aula B100",
    coordinates: {
      lat: -12.069032143182543,
      lng: -77.07819864342788,
    },
  },
};

export const pastEvents: Event[] = [
  {
    id: "1",
    title: "YOUNG (16 UNDER 29) ECOSYSTEM",
    description:
      "Únete a la nueva generación de emprendedores y innovadores en el ecosistema tech peruano. Un evento dedicado a jóvenes talentos bajo 29 años.",
    date: "4 de Octubre, 2025",
    time: "5:00 PM",
    image: "/images/events/evento-05-oct-25.jpg",
    tags: ["Networking", "Ecosystem", "Young Talents"],
    isPast: false,
    registrationLink: "/form",
  },
  {
    id: "2",
    title: "Sesión NoCode",
    description:
      "¡Transforma tus ideas en realidad de manera rápida y accesible! Con Fiorella Cisneros, Webflow Expert",
    date: "12 de Septiembre, 2024",
    time: "3:00 PM - 5:00 PM",
    image: "/images/events/evento-12-sep-24.png",
    tags: ["NoCode", "Webflow", "Workshop"],
    isPast: true,
  },
];
