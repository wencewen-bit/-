
export enum VoiceName {
  Kore = 'Kore',
  Puck = 'Puck',
  Charon = 'Charon',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr'
}

export interface TutorialSegment {
  id: string;
  title: string;
  text: string;
  audioUrl?: string;
  isGenerating: boolean;
  voice: VoiceName;
}

export interface VoiceOption {
  name: VoiceName;
  description: string;
  gender: 'Male' | 'Female' | 'Neutral';
}
