import { useState, useEffect, useCallback } from 'react';
import { BracketState, Team } from '../types';
import {
  createInitialBracket,
  advanceWinner,
  clearDownstreamMatchups,
  saveToLocalStorage,
  loadFromLocalStorage,
  findTeamById,
} from '../utils';

export function useBracket() {
  const [bracket, setBracket] = useState<BracketState>(() => {
    const saved = loadFromLocalStorage();
    return saved || createInitialBracket();
  });

  useEffect(() => {
    saveToLocalStorage(bracket);
  }, [bracket]);

  const updateTeam = useCallback((regionId: string, teamId: string, updates: Partial<Team>) => {
    setBracket(prev => ({
      ...prev,
      regions: prev.regions.map(region => {
        if (region.id !== regionId) return region;
        return {
          ...region,
          teams: region.teams.map(team => {
            if (team.id !== teamId) return team;
            return { ...team, ...updates };
          }),
        };
      }),
    }));
  }, []);

  const updateRegionName = useCallback((regionId: string, name: string) => {
    setBracket(prev => ({
      ...prev,
      regions: prev.regions.map(region => {
        if (region.id !== regionId) return region;
        return { ...region, name };
      }),
    }));
  }, []);

  const selectWinner = useCallback((regionId: string, matchupId: string, winnerId: string) => {
    setBracket(prev => {
      const region = prev.regions.find(r => r.id === regionId);
      if (!region) return prev;

      const matchup = region.matchups.find(m => m.id === matchupId);
      if (!matchup) return prev;

      let updatedMatchups = clearDownstreamMatchups(
        region.matchups,
        matchupId,
        matchup.winnerId
      );

      updatedMatchups = advanceWinner(updatedMatchups, matchupId, winnerId);

      const elite8Matchup = updatedMatchups.find(m => m.round === 4);
      let updatedFinalFour = { ...prev.finalFour };

      if (elite8Matchup?.winnerId) {
        const regionIndex = prev.regions.findIndex(r => r.id === regionId);
        
        if (regionIndex === 0 || regionIndex === 2) {
          updatedFinalFour = {
            ...updatedFinalFour,
            semifinal1: {
              ...updatedFinalFour.semifinal1,
              team1Id: regionIndex === 0 ? elite8Matchup.winnerId : updatedFinalFour.semifinal1.team1Id,
              team2Id: regionIndex === 2 ? elite8Matchup.winnerId : updatedFinalFour.semifinal1.team2Id,
            },
          };
        } else {
          updatedFinalFour = {
            ...updatedFinalFour,
            semifinal2: {
              ...updatedFinalFour.semifinal2,
              team1Id: regionIndex === 1 ? elite8Matchup.winnerId : updatedFinalFour.semifinal2.team1Id,
              team2Id: regionIndex === 3 ? elite8Matchup.winnerId : updatedFinalFour.semifinal2.team2Id,
            },
          };
        }
      }

      return {
        ...prev,
        regions: prev.regions.map(r => {
          if (r.id !== regionId) return r;
          return { ...r, matchups: updatedMatchups };
        }),
        finalFour: updatedFinalFour,
      };
    });
  }, []);

  const selectFinalFourWinner = useCallback((matchupKey: 'semifinal1' | 'semifinal2' | 'championship', winnerId: string) => {
    setBracket(prev => {
      const updatedFinalFour = { ...prev.finalFour };
      
      if (matchupKey === 'championship') {
        updatedFinalFour.championship = {
          ...updatedFinalFour.championship,
          winnerId,
        };
        
        const champion = findTeamById(prev.regions, winnerId);
        return {
          ...prev,
          finalFour: updatedFinalFour,
          champion,
        };
      }

      const previousWinner = updatedFinalFour[matchupKey].winnerId;
      
      if (previousWinner && previousWinner !== winnerId) {
        if (updatedFinalFour.championship.team1Id === previousWinner) {
          updatedFinalFour.championship.team1Id = null;
        }
        if (updatedFinalFour.championship.team2Id === previousWinner) {
          updatedFinalFour.championship.team2Id = null;
        }
        if (updatedFinalFour.championship.winnerId === previousWinner) {
          updatedFinalFour.championship.winnerId = null;
        }
      }

      updatedFinalFour[matchupKey] = {
        ...updatedFinalFour[matchupKey],
        winnerId,
      };

      if (matchupKey === 'semifinal1') {
        updatedFinalFour.championship.team1Id = winnerId;
      } else {
        updatedFinalFour.championship.team2Id = winnerId;
      }

      return {
        ...prev,
        finalFour: updatedFinalFour,
        champion: updatedFinalFour.championship.winnerId === winnerId ? null : prev.champion,
      };
    });
  }, []);

  const resetBracket = useCallback(() => {
    const fresh = createInitialBracket();
    setBracket(fresh);
    localStorage.removeItem('bracket-state');
  }, []);

  const getTeamById = useCallback((teamId: string | null): Team | null => {
    if (!teamId) return null;
    return findTeamById(bracket.regions, teamId);
  }, [bracket.regions]);

  return {
    bracket,
    updateTeam,
    updateRegionName,
    selectWinner,
    selectFinalFourWinner,
    resetBracket,
    getTeamById,
  };
}
