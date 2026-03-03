import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Team } from '../types';
import { fileToBase64 } from '../utils';

interface TeamSlotProps {
  team: Team;
  onUpdate: (updates: Partial<Team>) => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
}

export function TeamSlot({ 
  team, 
  onUpdate, 
  isSelectable = false,
  isSelected = false,
  onSelect,
  compact = false,
}: TeamSlotProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(team.name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        onUpdate({ image: base64 });
      }
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        onUpdate({ image: base64 });
      }
    }
  };

  const handleClick = () => {
    if (isSelectable && onSelect) {
      onSelect();
    } else if (!compact) {
      fileInputRef.current?.click();
    }
  };

  const handleNameSubmit = () => {
    onUpdate({ name: editName.trim() || `Seed ${team.seed}` });
    setIsEditing(false);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ image: null });
  };

  if (compact) {
    return (
      <div
        onClick={handleClick}
        className={`
          flex items-center gap-2 p-1.5 rounded cursor-pointer transition-all duration-200
          ${isSelectable ? 'hover:bg-bracket-accent/30' : ''}
          ${isSelected ? 'bg-bracket-accent ring-2 ring-bracket-gold' : 'bg-bracket-highlight/50'}
        `}
      >
        <span className="text-xs font-bold text-bracket-gold w-5 text-center">
          {team.seed}
        </span>
        {team.image ? (
          <img 
            src={team.image} 
            alt={team.name}
            className="w-6 h-6 rounded object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded bg-bracket-card flex items-center justify-center">
            <span className="text-xs text-gray-500">?</span>
          </div>
        )}
        <span className="text-xs text-white truncate flex-1 max-w-[80px]">
          {team.name}
        </span>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        relative flex items-center gap-3 p-3 rounded-lg cursor-pointer
        transition-all duration-200 group
        ${isDragging 
          ? 'bg-bracket-accent/40 border-2 border-dashed border-bracket-accent scale-105' 
          : 'bg-bracket-card hover:bg-bracket-highlight border-2 border-transparent'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <span className="text-lg font-bold text-bracket-gold w-8 text-center">
        {team.seed}
      </span>

      <div className="relative">
        {team.image ? (
          <>
            <img 
              src={team.image} 
              alt={team.name}
              className="w-12 h-12 rounded-lg object-cover ring-2 ring-bracket-highlight"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full 
                         flex items-center justify-center opacity-0 group-hover:opacity-100
                         transition-opacity text-white text-xs hover:bg-red-600"
            >
              ×
            </button>
          </>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-bracket-bg border-2 border-dashed border-gray-600 
                          flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {isEditing ? (
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleNameSubmit}
          onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
          onClick={(e) => e.stopPropagation()}
          autoFocus
          className="flex-1 bg-bracket-bg text-white px-2 py-1 rounded text-sm
                     border border-bracket-accent focus:outline-none focus:ring-2 focus:ring-bracket-accent"
        />
      ) : (
        <span 
          className="flex-1 text-white text-sm truncate"
          onDoubleClick={(e) => {
            e.stopPropagation();
            setEditName(team.name);
            setIsEditing(true);
          }}
        >
          {team.name}
        </span>
      )}

      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-bracket-accent/20 rounded-lg">
          <span className="text-bracket-accent font-medium">Drop image here</span>
        </div>
      )}
    </div>
  );
}
