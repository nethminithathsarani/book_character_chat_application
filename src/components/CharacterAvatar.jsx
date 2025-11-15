import React from 'react';

export function CharacterAvatar({ character, size = 'md', showThinking = false }) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const getAvatarEmoji = (id) => {
    const avatars = {
      '1': '⚡', // Harry - Lightning bolt
      '2': '📚', // Hermione - Book
      '3': '🧙', // Dumbledore - Wizard
      '4': '🐍', // Snape - Snake
      '5': '🌙', // Luna - Moon
      '6': '🦁', // McGonagall - Lion
    };
    return avatars[id] || '✨';
  };

  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-cyan-500 ring-blue-400',
    purple: 'bg-gradient-to-br from-purple-500 to-pink-500 ring-purple-400',
    gold: 'bg-gradient-to-br from-amber-500 to-yellow-500 ring-amber-400',
  };

  return (
    <div className="relative inline-block">
      <div
        className={`${sizeClasses[size]} ${colorClasses[character.color]} rounded-full flex items-center justify-center ring-4 ring-offset-2 ring-offset-slate-900 shadow-lg`}
      >
        <span className={size === 'sm' ? 'text-xl' : size === 'md' ? 'text-3xl' : 'text-5xl'}>
          {getAvatarEmoji(character.id)}
        </span>
      </div>
      
      {/* Thinking cloud animation */}
      {showThinking && (
        <div className="absolute -top-8 -right-8 animate-bounce">
          <div className="relative bg-white rounded-2xl px-4 py-2 shadow-lg">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            {/* Thinking cloud tail */}
            <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white transform rotate-45"></div>
            <div className="absolute -bottom-3 left-2 w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CharacterAvatar;
