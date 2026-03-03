interface HeaderProps {
  onReset: () => void;
}

export function Header({ onReset }: HeaderProps) {
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the dino battle? This cannot be undone! 🦕')) {
      onReset();
    }
  };

  return (
    <header className="bg-bracket-card/80 backdrop-blur-sm border-b border-bracket-highlight/30 sticky top-0 z-50">
      <div className="max-w-[1800px] mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/dino.svg" alt="Dino Logo" className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold text-white">🦖 Dino Battle Bracket 🦕</h1>
            <p className="text-sm text-gray-400">Who will be the ultimate prehistoric champion?</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400 hidden md:block">
            <span className="text-bracket-accent">🥚 Tip:</span> Drag dino images onto slots, click matchups to pick winners
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 
                       rounded-lg transition-colors border border-red-500/30"
          >
            🌋 Extinction Event
          </button>
        </div>
      </div>
    </header>
  );
}
