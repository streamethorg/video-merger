export interface Session {
  id: string
  name: string
  speakers: Speaker[]
}

export interface Speaker {
  name: string
  avatar: string
  twitter?: string
}
