import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Loader2, Wand2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MagicalParticles } from './MagicalParticles';
import { CharacterAvatar } from './CharacterAvatar';
import { getSelectedCharacter, ensureSessionId, saveSelectedCharacter } from '../lib/session';
import { sendChatMessage } from '../lib/api';

export function ChatInterface({ character, onBack, onBackToSummary }) {
  const [messages, setMessages] = useState(() => {
    // initialize with a character greeting if possible
    const selected = character || getSelectedCharacter();
    return selected ? [
      { id: 'init', sender: 'assistant', text: getInitialMessage(selected), timestamp: new Date() }
    ] : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  // Ensure selected character is persisted
  useEffect(() => {
    if (character) {
      try { saveSelectedCharacter(character); } catch (e) {}
    }
  }, [character]);

  // Use onBackToSummary if available, otherwise use onBack
  const handleBackClick = () => {
    if (onBackToSummary) {
      onBackToSummary();
    } else {
      onBack();
    }
  };

  function getInitialMessage(char) {
    const greetings = {
      '1': "Hello! I'm Harry Potter. It's good to meet you. What would you like to know about the wizarding world?",
      '2': "Hello! I'm Hermione Granger. I'd be happy to help answer your questions. What can I tell you about magic or Hogwarts?",
      '3': "Good day. I am Albus Dumbledore. Welcome. What wisdom do you seek, my friend?",
      '4': "Severus Snape here. State your business clearly. What is it you wish to discuss?",
      '5': "Hello! I'm Luna Lovegood. How wonderful to meet someone new! What curious things shall we talk about?",
      '6': "Good afternoon. Professor McGonagall speaking. How may I assist you today?",
    };
    return greetings[char.id] || "Hello! How may I assist you today?";
  }

  // compute css variables based on character traits or message emotion
  function computeStyleVars(char, message) {
    const base = { '--chat-bg-from': '#0f172a', '--chat-bg-to': '#001', '--bubble-user-from': '#0ea5e9', '--bubble-user-to': '#06b6d4', '--bubble-assist': '#334155' };
    if (!char) return base;
    // color mapping by char.color when provided
    if (char.color === 'blue') {
      base['--bubble-user-from'] = '#2563eb';
      base['--bubble-user-to'] = '#06b6d4';
      base['--bubble-assist'] = '#0f172a';
    } else if (char.color === 'purple') {
      base['--bubble-user-from'] = '#7c3aed';
      base['--bubble-user-to'] = '#ec4899';
      base['--bubble-assist'] = '#1f1238';
    } else if (char.color === 'gold' || char.color === 'amber') {
      base['--bubble-user-from'] = '#f59e0b';
      base['--bubble-user-to'] = '#fbbf24';
      base['--bubble-assist'] = '#2b2b0f';
    }
    // emotion hint (if message contains emotion attribute)
    if (message && message.emotion) {
      if (message.emotion === 'happy') {
        base['--bubble-assist'] = '#064e3b';
      } else if (message.emotion === 'angry') {
        base['--bubble-assist'] = '#7f1d1d';
      } else if (message.emotion === 'sad') {
        base['--bubble-assist'] = '#0f172a';
      }
    }
    return base;
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // ensure session
    const session_id = ensureSessionId();

    try {
      const res = await sendChatMessage({ character_id: (character && character.id) || (getSelectedCharacter() && getSelectedCharacter().id), message: userMessage.content, session_id });
      // expected res.reply { role: 'assistant', content: '...', emotion: 'happy' }
      const assistant = res && res.reply ? res.reply : { role: 'assistant', content: 'Sorry, no reply.', emotion: null };
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: assistant.role || 'assistant',
        content: assistant.content || (assistant.text || ''),
        emotion: assistant.emotion,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat API error', err);
      // fallback to a simple local reply to keep UX smooth
      const fallback = {
        id: (Date.now()+1).toString(),
        role: 'assistant',
        content: `I'm having trouble reaching the chat server. Please try again later.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallback]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'from-slate-900 via-blue-900 to-slate-900',
        message: 'from-blue-600 to-cyan-600',
        glow: 'shadow-blue-500/30',
        border: 'border-blue-500/30',
        focus: 'focus:border-blue-500',
      },
      purple: {
        bg: 'from-slate-900 via-purple-900 to-slate-900',
        message: 'from-purple-600 to-pink-600',
        glow: 'shadow-purple-500/30',
        border: 'border-purple-500/30',
        focus: 'focus:border-purple-500',
      },
      gold: {
        bg: 'from-slate-900 via-amber-900 to-slate-900',
        message: 'from-amber-600 to-yellow-600',
        glow: 'shadow-amber-500/30',
        border: 'border-amber-500/30',
        focus: 'focus:border-amber-500',
      },
    };
    return colors[color];
  };

  const selectedChar = character || getSelectedCharacter();
  const colorClasses = getColorClasses((selectedChar && selectedChar.color) || 'blue');
  const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
  const styleVars = computeStyleVars(selectedChar, lastAssistantMessage);

  return (
    <div style={styleVars} className={`h-screen flex flex-col bg-gradient-to-br ${colorClasses.bg}`}>
          <MagicalParticles color={(selectedChar && selectedChar.color) || 'blue'} density={25} />
      
      {/* Header - Mobile Friendly */}
      <div className={`relative z-10 bg-slate-800/90 backdrop-blur-sm ${colorClasses.border} border-b shadow-lg ${colorClasses.glow}`}>
        <div className="flex items-center gap-3 p-3 md:p-4">
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="text-white hover:bg-white/10 p-2"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          <CharacterAvatar character={selectedChar} size="sm" />
          <div className="flex-1 min-w-0">
            <h3 className="text-white truncate">{(selectedChar && selectedChar.name) || 'Character'}</h3>
            <p className="text-slate-300 truncate">{(selectedChar && selectedChar.role) || ''}</p>
          </div>
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-amber-400 animate-pulse flex-shrink-0" />
        </div>
      </div>

      {/* Messages - Smooth Scroll */}
      <div className="relative z-10 flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 scroll-smooth">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start items-start gap-2'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            {/* Show avatar for assistant messages */}
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 mt-1">
                <CharacterAvatar character={selectedChar || character} size="sm" />
              </div>
            )}
            
            <div
              style={
                message.role === 'user'
                  ? { background: `linear-gradient(90deg, ${styleVars['--bubble-user-from']}, ${styleVars['--bubble-user-to']})` }
                  : { backgroundColor: styleVars['--bubble-assist'] }
              }
              className={`max-w-[85%] md:max-w-md px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-lg text-white ${message.role === 'assistant' ? `${colorClasses.border} border ${colorClasses.glow}` : ''}`}
            >
              <p className="break-words">{message.content || message.text}</p>
              <p
                className={`mt-2 ${
                  message.role === 'user' ? 'text-white/70' : 'text-slate-400'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-2">
              <CharacterAvatar character={character} size="md" showThinking={true} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input - Mobile Optimized */}
      <div className={`relative z-10 bg-slate-800/90 backdrop-blur-sm ${colorClasses.border} border-t shadow-lg p-3 md:p-6`}>
        <div className="max-w-4xl mx-auto flex gap-2 md:gap-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${(selectedChar && selectedChar.name) || 'character'}...`}
            className={`flex-1 bg-slate-700/50 border-slate-600 ${colorClasses.focus} text-white placeholder:text-slate-400 rounded-full px-4 md:px-6 py-2 md:py-3`}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className={`bg-gradient-to-r ${colorClasses.message} hover:opacity-90 text-white shadow-md ${colorClasses.glow} rounded-full px-4 md:px-8 flex-shrink-0`}
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
