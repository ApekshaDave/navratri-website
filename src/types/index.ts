export type Language = 'gu' | 'hi' | 'en';

export type GarbaCategory = 
  | 'All'
  | 'Traditional' 
  | 'Devotional' 
  | '3 Tali' 
  | 'Dodhiyu' 
  | 'Hich' 
  | 'Titoda' 
  | 'Aarti' 
  | 'Dakla' 
  | 'Evergreen';

export type SectionType = 'chorus' | 'verse';

export interface LyricsSection {
  type: SectionType;
  label?: {
    gu?: string;
    hi?: string;
    en?: string;
  };
  lines: {
    gu: string[];
    hi?: string[];
    en?: string[];
  };
}

export interface AudioReference {
  url: string;
  duration: string; // e.g. "04:12"
  tempo?: string; // e.g. "Traditional 3-Tali"
  notes?: string;
}

export interface LyricsSource {
  name: string;
  url: string;
}

export interface Garba {
  id: string;
  title: {
    gu: string;
    hi: string;
    en: string;
  };
  category: GarbaCategory;
  description: {
    gu: string;
    hi: string;
    en: string;
  };
  deity: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  tags: string[];
  lyrics: {
    gu: string[];
    hi?: string[];
    en?: string[];
    sections: LyricsSection[];
  };
  audioReference?: AudioReference;
  lyricsSource: LyricsSource;
  artworkUrl: string;
}

export interface Navdurga {
  id: number;
  name: {
    gu: string;
    hi: string;
    en: string;
  };
  night: number;
  mantra: string;
  color: string;
  colorHex: string;
  description: {
    gu: string;
    hi: string;
    en: string;
  };
  iconName: string;
  image: string;
}
