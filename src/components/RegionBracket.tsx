import { useState } from 'react';
import { Region, Team, ROUND_NAMES } from '../types';
import { TeamSlot } from './TeamSlot';
import { MatchupCard } from './MatchupCard';
import { getMatchupsByRound } from '../utils';

interface RegionBracketProps {
  region: Region;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onUpdateName: (name: string) => void;
  onSelectWinner: (matchupId: string, winnerId: string) => void;
  getTeamById: (teamId: string | null) => Team | null;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function RegionBracket({
  region,
  onUpdateTeam,
  onUpdateName,
  onSelectWinner,
  getTeamById,
  position,
}: RegionBracketProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(region.name);
  const [showSeeds, setShowSeeds] = useState(false);

  const round1 = getMatchupsByRound(region.matchups, 1);
  const round2 = getMatchupsByRound(region.matchups, 2);
  const round3 = getMatchupsByRound(region.matchups, 3);
  const round4 = getMatchupsByRound(region.matchups, 4);

  const handleNameSubmit = () => {
    onUpdateName(editName.trim() || region.name);
    setIsEditingName(false);
  };

  const isRight = position.includes('right');

  const renderRound = (matchups: typeof round1, roundIndex: number) => (
    <div className="flex flex-col justify-around h-full gap-2">
      {matchups.map(matchup => (
        <MatchupCard
          key={matchup.id}
          matchup={matchup}
          team1={getTeamById(matchup.team1Id)}
          team2={getTeamById(matchup.team2Id)}
          onSelectWinner={(winnerId) => onSelectWinner(matchup.id, winnerId)}
          roundName={ROUND_NAMES[roundIndex]}
        />
      ))}
    </div>
  );

  const rounds = [
    { matchups: round1, index: 0 },
    { matchups: round2, index: 1 },
    { matchups: round3, index: 2 },
    { matchups: round4, index: 3 },
  ];

  const orderedRounds = isRight ? [...rounds].reverse() : rounds;

  return (
    <div className="bg-bracket-bg/30 rounded-xl p-4 backdrop-blur-sm border border-bracket-highlight/30">
      <div className="flex items-center justify-between mb-4">
        {isEditingName ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
            autoFocus
            className="text-xl font-bold bg-bracket-bg text-bracket-gold px-3 py-1 rounded
                       border border-bracket-accent focus:outline-none focus:ring-2 focus:ring-bracket-accent"
          />
        ) : (
          <h2 
            className="text-xl font-bold text-bracket-gold cursor-pointer hover:text-bracket-accent transition-colors"
            onClick={() => {
              setEditName(region.name);
              setIsEditingName(true);
            }}
            title="Click to rename region"
          >
            {region.name}
          </h2>
        )}
        
        <button
          onClick={() => setShowSeeds(!showSeeds)}
          className="px-3 py-1 text-sm bg-bracket-highlight hover:bg-bracket-accent 
                     text-white rounded transition-colors"
        >
          {showSeeds ? 'Show Bracket' : 'Edit Seeds'}
        </button>
      </div>

      {showSeeds ? (
        <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto pr-2">
          {region.teams
            .sort((a, b) => a.seed - b.seed)
            .map(team => (
              <TeamSlot
                key={team.id}
                team={team}
                onUpdate={(updates) => onUpdateTeam(team.id, updates)}
              />
            ))}
        </div>
      ) : (
        <div className={`flex gap-3 ${isRight ? 'flex-row-reverse' : ''}`}>
          {orderedRounds.map(({ matchups, index }) => (
            <div key={index} className="flex-1 min-w-[140px]">
              {renderRound(matchups, index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
