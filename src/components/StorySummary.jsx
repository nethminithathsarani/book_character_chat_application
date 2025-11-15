import { BookOpen, Sparkles, Wand2, ArrowLeft, MessageCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback.jsx';
import { MagicalParticles } from './MagicalParticles.jsx';
import { CharacterAvatar } from './CharacterAvatar.jsx';
import { useEffect, useState } from 'react';
import { getDocumentId, saveSelectedCharacter } from '../lib/session';
import { extractCharacters, generateAvatar } from '../lib/api';

const mockCharacters = [
  {
    id: '1',
    name: 'Harry Potter',
    personality: 'Brave and loyal',
    role: 'Protagonist',
    image: 'https://images.unsplash.com/photo-1760574772950-f37de9dce85c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXJyeSUyMHBvdHRlciUyMHdpemFyZCUyMGJveXxlbnwxfHx8fDE3NjI2ODIxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'gold',
    traits: ['Brave', 'Loyal', 'Determined', 'Compassionate', 'Selfless'],
    quotes: [
      "It does not do to dwell on dreams and forget to live.",
      "We've all got both light and dark inside us.",
      "Expecto Patronum!"
    ],
    description: 'The Boy Who Lived, destined to face the dark wizard Voldemort. Harry is brave, loyal, and willing to sacrifice everything for those he loves.'
  },
  {
    id: '2',
    name: 'Hermione Granger',
    personality: 'Intelligent and resourceful',
    role: 'Protagonist',
    image: 'https://images.unsplash.com/photo-1544586299-3d57a7371280?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJtaW9uZSUyMGdyYW5nZXIlMjBzdHVkZW50fGVufDF8fHx8MTc2MjY4MjE0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'blue',
    traits: ['Intelligent', 'Resourceful', 'Brave', 'Studious', 'Loyal'],
    quotes: [
      "Books! And cleverness! There are more important things — friendship and bravery.",
      "Fear of a name increases fear of the thing itself.",
      "When in doubt, go to the library."
    ],
    description: 'The brightest witch of her age, known for her encyclopedic knowledge and unwavering loyalty. Hermione believes books and cleverness are key to solving any problem.'
  },
  {
    id: '3',
    name: 'Albus Dumbledore',
    personality: 'Wise and powerful',
    role: 'Mentor',
    image: 'https://images.unsplash.com/photo-1600637453426-7c64826b19d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdW1ibGVkb3JlJTIwd2l6YXJkJTIwb2xkfGVufDF8fHx8MTc2MjY4MjE0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'purple',
    traits: ['Wise', 'Powerful', 'Kind', 'Mysterious', 'Strategic'],
    quotes: [
      "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.",
      "It is our choices that show what we truly are, far more than our abilities.",
      "After all this time? Always."
    ],
    description: 'The legendary Headmaster of Hogwarts, considered the only wizard Voldemort ever feared. Dumbledore is wise beyond measure and believes in the power of love and choice.'
  },
  {
    id: '4',
    name: 'Severus Snape',
    personality: 'Complex and mysterious',
    role: 'Anti-Hero',
    image: 'https://images.unsplash.com/photo-1626934459213-7109dd5058f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmFwZSUyMHByb2Zlc3NvciUyMGRhcmt8ZW58MXx8fHwxNzYyNjgyMTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'purple',
    traits: ['Mysterious', 'Loyal', 'Brave', 'Misunderstood', 'Brilliant'],
    quotes: [
      "Always.",
      "You have your mother's eyes.",
      "Turn to page 394."
    ],
    description: 'The enigmatic Potions Master with a troubled past. Snape\'s true loyalties remain hidden beneath layers of complexity, driven by a love that transcends death.'
  },
  {
    id: '5',
    name: 'Luna Lovegood',
    personality: 'Quirky and wise',
    role: 'Supporting Character',
    image: 'https://images.unsplash.com/photo-1570370433392-b61a344aba41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdW5hJTIwbG92ZWdvb2QlMjBkcmVhbXl8ZW58MXx8fHwxNzYyNjgyMTUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'blue',
    traits: ['Quirky', 'Wise', 'Accepting', 'Imaginative', 'Brave'],
    quotes: [
      "You're just as sane as I am.",
      "Things we lose have a way of coming back to us in the end.",
      "I've been able to see them ever since my first day here."
    ],
    description: 'A dreamy and eccentric Ravenclaw who sees the world through a unique lens. Luna\'s acceptance of the extraordinary makes her wonderfully genuine and brave.'
  },
  {
    id: '6',
    name: 'Minerva McGonagall',
    personality: 'Strict but caring',
    role: 'Mentor',
    image: 'https://images.unsplash.com/photo-1750853764097-98dd82f78bbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtY2dvbmFnYWxsJTIwcHJvZmVzc29yJTIwc3Rlcm58ZW58MXx8fHwxNzYyNjgyMTUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'gold',
    traits: ['Strict', 'Fair', 'Brave', 'Protective', 'Skilled'],
    quotes: [
      "It takes a great deal of bravery to stand up to our enemies, but just as much to stand up to our friends.",
      "Have a biscuit, Potter.",
      "Transfiguration is some of the most complex and dangerous magic you will learn at Hogwarts."
    ],
    description: 'The stern but fair Transfiguration professor and Head of Gryffindor House. McGonagall\'s sharp wit is matched only by her fierce protectiveness of her students.'
  },
];

export function StorySummary({ storyData, onCharacterSelect, onBack, onDirectChat }) {
  const [characters, setCharacters] = useState(mockCharacters);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const docId = getDocumentId();
    if (!docId) return; // nothing to fetch

    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await extractCharacters(docId);
        let chars = res && res.characters ? res.characters : [];

        // enrich with avatar from backend
        const enhanced = await Promise.all(chars.map(async (c, idx) => {
          try {
            const avatarRes = await generateAvatar({ name: c.name, traits: c.traits || [] });
            return { ...c, avatar_base64: avatarRes?.avatar_base64 };
          } catch (e) {
            // Continue with original char if avatar fails
            return c;
          }
        }));

        if (mounted && enhanced.length > 0) {
          setCharacters(enhanced);
        }
      } catch (e) {
        console.warn('Failed to extract characters, using mock data', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [storyData]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Magical Particles */}
      <MagicalParticles color="gold" density={40} />
      
      {/* Decorative glowing elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Library
        </Button>

        {/* Header - Enhanced and Bigger */}
        <div className="text-center mb-16">
          <div className="inline-flex flex-col items-center gap-4 mb-8 p-8 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-purple-500/40 shadow-purple-500/30 max-w-3xl">
            <div className="flex items-center gap-4">
              <Wand2 className="w-12 h-12 text-amber-400 animate-pulse" />
              <h1 className="text-white">
                {storyData.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-300" />
              <p className="text-purple-200">
                by {storyData.author}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <p className="text-slate-300">
                6 Magical Characters Detected
              </p>
            </div>
          </div>
        </div>

        {/* Story Summary */}
        <Card className="mb-12 bg-slate-800/80 backdrop-blur-sm border-purple-500/30 shadow-2xl shadow-purple-500/20">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h2 className="text-white">Story Summary</h2>
            </div>
            <p className="text-slate-200 leading-relaxed">
              Follow Harry Potter, an orphaned boy who discovers he's a wizard on his eleventh birthday. 
              He attends Hogwarts School of Witchcraft and Wizardry, where he makes lifelong friends, 
              learns powerful magic, and uncovers the truth about his past. As he faces the dark wizard 
              Lord Voldemort, Harry must navigate challenges that test not only his magical abilities 
              but his courage, loyalty, and capacity for love in this epic tale of good versus evil.
            </p>
          </div>
        </Card>

        {/* Characters Section */}
        <div className="mb-8 flex items-center gap-3">
          <h2 className="text-white">Detected Characters</h2>
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(characters || mockCharacters).map((character) => {
            const glowColor = 
              character.color === 'blue' ? 'shadow-blue-500/50' :
              character.color === 'purple' ? 'shadow-purple-500/50' :
              'shadow-amber-500/50';
            
            const badgeBg = 
              character.color === 'blue' ? 'bg-blue-500' :
              character.color === 'purple' ? 'bg-purple-500' :
              'bg-amber-500';
              
            const buttonGradient =
              character.color === 'blue' ? 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700' :
              character.color === 'purple' ? 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' :
              'from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700';
              
            return (
              <Card 
                key={character.id}
                className={`group bg-slate-800/80 backdrop-blur-sm border-${character.color}-500/30 shadow-lg ${glowColor} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
              >
                {/* Avatar Section */}
                <div className="flex justify-center pt-8 pb-4">
                  <CharacterAvatar character={character} size="lg" />
                </div>
                
                <div className="p-6 pt-2">
                  <div className="text-center mb-4">
                    <h3 className="text-white mb-2">{character.name}</h3>
                    <Badge 
                      className={`${badgeBg} text-white border-0 shadow-lg mb-3`}
                    >
                      {character.role}
                    </Badge>
                  </div>
                  
                  {/* Two-line description */}
                  <p className="text-slate-300 mb-4 line-clamp-2">
                    {character.description}
                  </p>
                  
                  <div className="flex gap-2 flex-wrap mb-4 justify-center">
                    {character.traits.slice(0, 3).map((trait, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className={`bg-${character.color}-500/10 text-${character.color}-200 border-${character.color}-500/30`}
                      >
                        {trait}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Direct Chat Button */}
                  {onDirectChat && (
                    <Button 
                      onClick={() => {
                        // persist selected character and navigate to /chat/:id
                        try { saveSelectedCharacter(character); } catch (e) {}
                        try { history.pushState(null, '', `/chat/${character.id}`); } catch(e) {}
                        onDirectChat(character);
                      }}
                      className={`w-full bg-gradient-to-r ${buttonGradient} text-white shadow-md`}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StorySummary;
