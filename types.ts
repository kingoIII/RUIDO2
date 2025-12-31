export interface Sample {
  id: string;
  title: string;
  producerId: string;
  producerName: string;
  packId?: string;
  genre: string;
  bpm: number;
  key: string;
  type: 'Loop' | 'One-shot';
  price: number;
  licensesSold: number;
  maxLicenses: number;
  audioUrl: string;
  tags: string[];
  description: string;
}

export interface SoundPack {
  id: string;
  title: string;
  producerId: string;
  producerName: string;
  sampleCount: number;
  genre: string;
  coverImage: string;
  description: string;
}

export interface Producer {
  id: string;
  name: string;
  specialization: string[];
  bio: string;
  avatar: string;
  sampleCount: number;
  rating: number;
}

export type AppView = 'LANDING' | 'ORACLE_CORE' | 'VAULT' | 'REGISTRY' | 'AUTH';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  recommendations?: {
    samples?: string[];
    producers?: string[];
  };
  uiTrigger?: 'UPLOAD_FORM' | 'SIGN_ON' | 'SUCCESS_STAMP' | 'GOTO_VAULT' | 'GOTO_REGISTRY' | 'GOTO_AUTH';
}

export interface UserState {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'Artist' | 'Collector';
}