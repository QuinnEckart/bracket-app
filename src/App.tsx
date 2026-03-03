import { Header, RegionBracket, FinalFour } from './components';
import { useBracket } from './hooks/useBracket';

function App() {
  const {
    bracket,
    updateTeam,
    updateRegionName,
    selectWinner,
    selectFinalFourWinner,
    resetBracket,
    getTeamById,
  } = useBracket();

  const regionPositions = [
    'top-left',
    'top-right', 
    'bottom-left',
    'bottom-right',
  ] as const;

  return (
    <div className="min-h-screen bg-bracket-bg">
      <Header onReset={resetBracket} />
      
      <main className="max-w-[1800px] mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {bracket.regions.slice(0, 2).map((region, index) => (
            <RegionBracket
              key={region.id}
              region={region}
              onUpdateTeam={(teamId, updates) => updateTeam(region.id, teamId, updates)}
              onUpdateName={(name) => updateRegionName(region.id, name)}
              onSelectWinner={(matchupId, winnerId) => selectWinner(region.id, matchupId, winnerId)}
              getTeamById={getTeamById}
              position={regionPositions[index]}
            />
          ))}
        </div>

        <div className="mb-6">
          <FinalFour
            finalFour={bracket.finalFour}
            getTeamById={getTeamById}
            onSelectWinner={selectFinalFourWinner}
            champion={bracket.champion}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bracket.regions.slice(2, 4).map((region, index) => (
            <RegionBracket
              key={region.id}
              region={region}
              onUpdateTeam={(teamId, updates) => updateTeam(region.id, teamId, updates)}
              onUpdateName={(name) => updateRegionName(region.id, name)}
              onSelectWinner={(matchupId, winnerId) => selectWinner(region.id, matchupId, winnerId)}
              getTeamById={getTeamById}
              position={regionPositions[index + 2]}
            />
          ))}
        </div>
      </main>

      <footer className="bg-bracket-card/50 border-t border-bracket-highlight/30 py-4 mt-8">
        <div className="max-w-[1800px] mx-auto px-4 text-center text-sm text-gray-500">
          <p>Tournament Bracket Builder • Your bracket is saved automatically in your browser</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
