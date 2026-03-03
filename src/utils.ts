import { Team, Matchup, Region, FinalFour, BracketState, SEEDS } from './types';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function createEmptyTeam(seed: number, regionId: string): Team {
  return {
    id: `${regionId}-seed-${seed}`,
    seed,
    name: `Dino #${seed}`,
    image: null,
  };
}

export function createRegionMatchups(regionId: string): Matchup[] {
  const matchups: Matchup[] = [];
  
  for (let i = 0; i < 8; i++) {
    matchups.push({
      id: `${regionId}-r1-${i}`,
      round: 1,
      position: i,
      team1Id: `${regionId}-seed-${SEEDS[i * 2]}`,
      team2Id: `${regionId}-seed-${SEEDS[i * 2 + 1]}`,
      winnerId: null,
    });
  }
  
  for (let i = 0; i < 4; i++) {
    matchups.push({
      id: `${regionId}-r2-${i}`,
      round: 2,
      position: i,
      team1Id: null,
      team2Id: null,
      winnerId: null,
    });
  }
  
  for (let i = 0; i < 2; i++) {
    matchups.push({
      id: `${regionId}-r3-${i}`,
      round: 3,
      position: i,
      team1Id: null,
      team2Id: null,
      winnerId: null,
    });
  }
  
  matchups.push({
    id: `${regionId}-r4-0`,
    round: 4,
    position: 0,
    team1Id: null,
    team2Id: null,
    winnerId: null,
  });
  
  return matchups;
}

export function createEmptyRegion(id: string, name: string): Region {
  const teams = SEEDS.map(seed => createEmptyTeam(seed, id));
  const matchups = createRegionMatchups(id);
  
  return {
    id,
    name,
    teams,
    matchups,
  };
}

export function createEmptyFinalFour(): FinalFour {
  return {
    semifinal1: {
      id: 'ff-semi-1',
      round: 5,
      position: 0,
      team1Id: null,
      team2Id: null,
      winnerId: null,
    },
    semifinal2: {
      id: 'ff-semi-2',
      round: 5,
      position: 1,
      team1Id: null,
      team2Id: null,
      winnerId: null,
    },
    championship: {
      id: 'ff-final',
      round: 6,
      position: 0,
      team1Id: null,
      team2Id: null,
      winnerId: null,
    },
  };
}

export function createInitialBracket(): BracketState {
  return {
    regions: [
      createEmptyRegion('region-1', 'Jurassic'),
      createEmptyRegion('region-2', 'Cretaceous'),
      createEmptyRegion('region-3', 'Triassic'),
      createEmptyRegion('region-4', 'Pangaea'),
    ],
    finalFour: createEmptyFinalFour(),
    champion: null,
  };
}

export function getMatchupsByRound(matchups: Matchup[], round: number): Matchup[] {
  return matchups.filter(m => m.round === round).sort((a, b) => a.position - b.position);
}

export function getNextMatchup(matchups: Matchup[], currentMatchup: Matchup): Matchup | null {
  const nextRound = currentMatchup.round + 1;
  const nextPosition = Math.floor(currentMatchup.position / 2);
  return matchups.find(m => m.round === nextRound && m.position === nextPosition) || null;
}

export function findTeamById(regions: Region[], teamId: string): Team | null {
  for (const region of regions) {
    const team = region.teams.find(t => t.id === teamId);
    if (team) return team;
  }
  return null;
}

export function advanceWinner(
  matchups: Matchup[],
  matchupId: string,
  winnerId: string
): Matchup[] {
  const updatedMatchups = matchups.map(m => {
    if (m.id === matchupId) {
      return { ...m, winnerId };
    }
    return m;
  });
  
  const currentMatchup = updatedMatchups.find(m => m.id === matchupId);
  if (!currentMatchup) return updatedMatchups;
  
  const nextMatchup = getNextMatchup(updatedMatchups, currentMatchup);
  if (!nextMatchup) return updatedMatchups;
  
  const isTopSlot = currentMatchup.position % 2 === 0;
  
  return updatedMatchups.map(m => {
    if (m.id === nextMatchup.id) {
      return {
        ...m,
        team1Id: isTopSlot ? winnerId : m.team1Id,
        team2Id: isTopSlot ? m.team2Id : winnerId,
      };
    }
    return m;
  });
}

export function clearDownstreamMatchups(
  matchups: Matchup[],
  matchupId: string,
  previousWinnerId: string | null
): Matchup[] {
  if (!previousWinnerId) return matchups;
  
  const currentMatchup = matchups.find(m => m.id === matchupId);
  if (!currentMatchup) return matchups;
  
  let updated = [...matchups];
  let roundToCheck = currentMatchup.round + 1;
  let teamIdToRemove = previousWinnerId;
  
  while (roundToCheck <= 4) {
    const nextMatchup = updated.find(
      m => m.round === roundToCheck && 
      (m.team1Id === teamIdToRemove || m.team2Id === teamIdToRemove)
    );
    
    if (!nextMatchup) break;
    
    const wasWinner = nextMatchup.winnerId === teamIdToRemove;
    
    updated = updated.map(m => {
      if (m.id === nextMatchup.id) {
        return {
          ...m,
          team1Id: m.team1Id === teamIdToRemove ? null : m.team1Id,
          team2Id: m.team2Id === teamIdToRemove ? null : m.team2Id,
          winnerId: m.winnerId === teamIdToRemove ? null : m.winnerId,
        };
      }
      return m;
    });
    
    if (!wasWinner) break;
    roundToCheck++;
  }
  
  return updated;
}

export function saveToLocalStorage(state: BracketState): void {
  try {
    localStorage.setItem('bracket-state', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save bracket state:', e);
  }
}

export function loadFromLocalStorage(): BracketState | null {
  try {
    const saved = localStorage.getItem('bracket-state');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load bracket state:', e);
  }
  return null;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
