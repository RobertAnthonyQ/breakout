export type OpportunityType =
  | "internship"
  | "postgraduate"
  | "masters"
  | "competition"
  | "postdoc"
  | "course"
  | "doctorate"
  | "fellowship"
  | "short_program"
  | "workshop"
  | "training"
  | "scholarship"
  | "bootcamp"
  | "summer_school"
  | "conference"
  | "event"
  | "summer_program"
  | "highschool"
  | "mentorship"
  | "hackathon"
  | "other"

export interface Opportunity {
  id: string
  title: string
  type: OpportunityType
  area: string
  country: string
  city?: string
  institution?: string
  lat: number
  lng: number
  deadline: string
  openDate: string
  url: string
  targetAudience: string
  note: string
  phase: string
  isRemote: boolean
  isActive: boolean
}

export const OPPORTUNITY_TYPES: Record<OpportunityType, { label: string }> = {
  internship: { label: "Pasantía" },
  postgraduate: { label: "Posgrado" },
  masters: { label: "Maestría" },
  competition: { label: "Competencia" },
  postdoc: { label: "Posdoc" },
  course: { label: "Curso" },
  doctorate: { label: "Doctorado" },
  fellowship: { label: "Fellowship" },
  short_program: { label: "Programa Corto" },
  workshop: { label: "Taller" },
  training: { label: "Capacitación" },
  scholarship: { label: "Beca" },
  bootcamp: { label: "Bootcamp" },
  summer_school: { label: "Escuela de Verano" },
  conference: { label: "Conferencia" },
  event: { label: "Evento" },
  summer_program: { label: "Programa de Verano" },
  highschool: { label: "Secundaria" },
  mentorship: { label: "Mentoría" },
  hackathon: { label: "Hackathon" },
  other: { label: "Otro" },
}
