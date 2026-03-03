export interface Team {
  id: string;
  seed: number;
  name: string;
  image: string | null;
}

export interface Matchup {
  id: string;
  round: number;
  position: number;
  team1Id: string | null;
  team2Id: string | null;
  winnerId: string | null;
}

export interface Region {
  id: string;
  name: string;
  teams: Team[];
  matchups: Matchup[];
}

export interface FinalFour {
  semifinal1: Matchup;
  semifinal2: Matchup;
  championship: Matchup;
}

export interface BracketState {
  regions: Region[];
  finalFour: FinalFour;
  champion: Team | null;
}

export type RoundName = 'Round of 64' | 'Round of 32' | 'Sweet 16' | 'Elite 8' | 'Final Four' | 'Championship';

export const ROUND_NAMES: RoundName[] = [
  'Round of 64',
  'Round of 32', 
  'Sweet 16',
  'Elite 8',
  'Final Four',
  'Championship'
];

export const SEEDS = [1, 16, 8, 9, 5, 12, 4, 13, 6, 11, 3, 14, 7, 10, 2, 15] as const;
