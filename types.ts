export enum AppState {
  Idle = 'IDLE',
  Loading = 'LOADING',
  Success = 'SUCCESS',
  Error = 'ERROR',
}

export interface ComicPanel {
  scene: number;
  description: string;
  narration: string;
  imageUrl?: string;
}

export interface ComicData {
  title: string;
  panels: ComicPanel[];
  summary: string;
}
