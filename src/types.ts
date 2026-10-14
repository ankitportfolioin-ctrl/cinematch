export interface WizardAnswers {
  mood: string;
  genres: string[];
  audience: string;
  maxRuntime: string;
  languages: string[];
  preferences: {
    highlyRated: boolean;
    hiddenGems: boolean;
    recent: boolean;
    classics: boolean;
    mature: boolean;
  };
  note: string;
}

export interface Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
  runtime: number;
  rating: number;
  overview: string;
  posterUrl: string;
  providers: { name: string; logoUrl: string }[];
  reason: string;
  isHiddenGem?: boolean;
}

export interface UserData {
  mood: string;
  genres: string[];
  audience: string;
  maxRuntime: number;
  languages: string[];
  preferences: {
    highlyRated: boolean;
    hiddenGems: boolean;
    recent: boolean;
    classics: boolean;
    mature: boolean;
  };
  note: string;
  excludeIds: number[];
}
