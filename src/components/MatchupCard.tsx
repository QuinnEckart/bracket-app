import { Team, Matchup } from '../types';
import { TeamSlot } from './TeamSlot';

interface MatchupCardProps {
  matchup: Matchup;
  team1: Team | null;
  team2: Team | null;
  onSelectWinner: (winnerId: string) => void;
  roundName: string;
}

export function MatchupCard({ 
  matchup, 
  team1, 
  team2, 
  onSelectWinner,
  roundName,
}: MatchupCardProps) {
  const canSelect = team1 !== null && team2 !== null;
  const hasWinner = matchup.winnerId !== null;

  return (
    <div className="bg-bracket-card/50 rounded-lg p-2 backdrop-blur-sm">
      <div className="text-[10px] text-gray-500 mb-1 text-center uppercase tracking-wider">
        {roundName}
      </div>
      
      <div className="space-y-1">
        {team1 ? (
          <TeamSlot
            team={team1}
            onUpdate={() => {}}
            isSelectable={canSelect}
            isSelected={matchup.winnerId === team1.id}
            onSelect={() => onSelectWinner(team1.id)}
            compact
          />
        ) : (
          <div className="h-9 bg-bracket-bg/50 rounded flex items-center justify-center">
            <span className="text-xs text-gray-600">TBD</span>
          </div>
        )}

        <div className="flex items-center gap-2 px-2">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-[10px] text-gray-500">vs</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        {team2 ? (
          <TeamSlot
            team={team2}
            onUpdate={() => {}}
            isSelectable={canSelect}
            isSelected={matchup.winnerId === team2.id}
            onSelect={() => onSelectWinner(team2.id)}
            compact
          />
        ) : (
          <div className="h-9 bg-bracket-bg/50 rounded flex items-center justify-center">
            <span className="text-xs text-gray-600">TBD</span>
          </div>
        )}
      </div>

      {hasWinner && (
        <div className="mt-1 text-center">
          <span className="text-[10px] text-bracket-gold">★ Winner Selected</span>
        </div>
      )}
    </div>
  );
}
