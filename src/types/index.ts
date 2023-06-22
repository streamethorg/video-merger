export interface Stream {
  id: string;
}

export interface Stage {
  id: string;
  name: string;
  stream: Stream[];
}

export interface Speaker {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
}

export interface Session {
  id: string;
  name: string;
  abstract: string;
  description: string;
  track: string;
  start: number;
  end: number;
  stage: Stage;
  speakers: Speaker[];
}