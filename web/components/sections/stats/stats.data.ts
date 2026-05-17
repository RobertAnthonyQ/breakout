export interface Stat {
  value: number
  suffix: string
  label: string
}

export const stats: Stat[] = [
  { value: 500, suffix: "+", label: "Miembros" },
  { value: 50, suffix: "+", label: "Eventos" },
  { value: 20, suffix: "+", label: "Startups" },
  { value: 15, suffix: "+", label: "Speakers" },
]
