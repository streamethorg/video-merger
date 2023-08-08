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
    avatarUrl?: string;
    name: string;
}

export interface Session {
    id: string;
    name: string;
    description?: string;
    start: number;
    end: number;
    stage: Stage;
    speakers?: Speaker[];
    video?: string;
    startCut?: string;
    endCut?: string;
}
