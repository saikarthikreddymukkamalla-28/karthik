export type Category =
  | "AI" | "DSA" | "Java" | "HLD" | "Cybersecurity"
  | "Cloud" | "Hardware" | "Career" | "Programming" | "Funny" | "Other";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Reel {
  id: string;
  title: string;
  creator: string;
  category: Category;
  topics: string[];
  relatedTopics: string[];
  context: string;
  difficulty: Difficulty;
  technicalDepth: number;
  educationalValue: number;
  careerRelevance: number;
  entertainmentValue: number;
  hypeScore: number;
  duration: number;
  description: string;
  gradient: string;
  // Imported video fields
  sourceUrl?: string;
  embedType?: "youtube" | "instagram" | "direct";
  youtubeId?: string;
  isFunny?: boolean;
  isUserImported?: boolean;
}

export interface Interaction {
  reelId: string;
  watchPercentage: number;
  watchDuration: number;
  liked: boolean;
  saved: boolean;
  replayed: boolean;
  skipped: boolean;
  notInterested: boolean;
  timestamp: number;
}

export interface StudentProfile {
  interests: Record<string, number>;
  skills: Record<string, number>;
  interactions: Interaction[];
  saved: string[];
  liked: string[];
  rejected: string[];
  technicalMinutes: number;
  conceptsLearned: number;
  skillImprovements: number;
  gapsClosed: number;
  streak: number;
  lastActive: string;
}