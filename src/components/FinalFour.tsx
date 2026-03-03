import { FinalFour as FinalFourType, Team } from '../types';
import { MatchupCard } from './MatchupCard';

interface FinalFourProps {
  finalFour: FinalFourType;
  getTeamById: (teamId: string | null) => Team | null;
  onSelectWinner: (matchupKey: 'semifinal1' | 'semifinal2' | 'championship', winnerId: string) => void;
  champion: Team | null;
}

export function FinalFour({ 
  finalFour, 
  getTeamById, 
  onSelectWinner,
  champion,
}: FinalFourProps) {
  return (
    <div className="bg-gradient-to-b from-bracket-highlight/50 to-bracket-bg/50 rounded-xl p-6 
                    backdrop-blur-sm border border-bracket-gold/30">
      <h2 className="text-2xl font-bold text-bracket-gold text-center mb-6">
        🏆 Final Four
      </h2>

      <div className="flex items-center justify-center gap-8">
        <div className="w-48">
          <MatchupCard
            matchup={finalFour.semifinal1}
            team1={getTeamById(finalFour.semifinal1.team1Id)}
            team2={getTeamById(finalFour.semifinal1.team2Id)}
            onSelectWinner={(winnerId) => onSelectWinner('semifinal1', winnerId)}
            roundName="Semifinal 1"
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-56">
            <MatchupCard
              matchup={finalFour.championship}
              team1={getTeamById(finalFour.championship.team1Id)}
              team2={getTeamById(finalFour.championship.team2Id)}
              onSelectWinner={(winnerId) => onSelectWinner('championship', winnerId)}
              roundName="Championship"
            />
          </div>

          {champion && (
            <div className="bg-gradient-to-r from-bracket-gold/20 via-bracket-gold/40 to-bracket-gold/20 
                            rounded-xl p-4 text-center animate-pulse">
              <div className="text-sm text-bracket-gold mb-2">🎉 CHAMPION 🎉</div>
              <div className="flex items-center justify-center gap-3">
                {champion.image ? (
                  <img 
                    src={champion.image} 
                    alt={champion.name}
                    className="w-16 h-16 rounded-lg object-cover ring-4 ring-bracket-gold"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-bracket-card flex items-center justify-center ring-4 ring-bracket-gold">
                    <span className="text-2xl">🏆</span>
                  </div>
                )}
                <div>
                  <div className="text-xl font-bold text-white">{champion.name}</div>
                  <div className="text-sm text-bracket-gold">#{champion.seed} Seed</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-48">
          <MatchupCard
            matchup={finalFour.semifinal2}
            team1={getTeamById(finalFour.semifinal2.team1Id)}
            team2={getTeamById(finalFour.semifinal2.team2Id)}
            onSelectWinner={(winnerId) => onSelectWinner('semifinal2', winnerId)}
            roundName="Semifinal 2"
          />
        </div>
      </div>
    </div>
  );
}
