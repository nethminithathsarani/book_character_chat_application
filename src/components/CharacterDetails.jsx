import { ArrowLeft, MessageCircle, Quote, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback.jsx';
import { MagicalParticles } from './MagicalParticles.jsx';

export function CharacterDetails({ character, onStartChat, onBack }) {
  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'from-slate-900 via-blue-900 to-slate-900',
        text: 'text-blue-100',
        gradient: 'from-blue-600 to-cyan-600',
        glow: 'shadow-blue-500/50',
        badge: 'bg-blue-500',
        border: 'border-blue-500/30',
      },
      purple: {
        bg: 'from-slate-900 via-purple-900 to-slate-900',
        text: 'text-purple-100',
        gradient: 'from-purple-600 to-pink-600',
        glow: 'shadow-purple-500/50',
        badge: 'bg-purple-500',
        border: 'border-purple-500/30',
      },
      gold: {
        bg: 'from-slate-900 via-amber-900 to-slate-900',
        text: 'text-amber-100',
        gradient: 'from-amber-600 to-yellow-600',
        glow: 'shadow-amber-500/50',
        badge: 'bg-amber-500',
        border: 'border-amber-500/30',
      },
    };
    return colors[color];
  };

  const colorClasses = getColorClasses(character.color);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colorClasses.bg} relative overflow-hidden`}>
      {/* Magical Particles */}
      <MagicalParticles color={character.color} density={35} />
      
      {/* Decorative glowing elements */}
      <div className={`absolute top-0 left-0 w-96 h-96 ${colorClasses.badge}/20 rounded-full blur-3xl animate-pulse`}></div>
      <div className={`absolute bottom-0 right-0 w-96 h-96 ${colorClasses.badge}/20 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 min-h-screen p-4 md:p-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className={`mb-8 text-white hover:bg-white/10`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Characters
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Character Portrait */}
          <Card className={`mb-8 bg-slate-800/80 backdrop-blur-sm ${colorClasses.border} shadow-2xl ${colorClasses.glow} overflow-hidden`}>
            <div className="relative h-96 overflow-hidden">
              <ImageWithFallback
                src={character.image}
                alt={character.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute top-4 right-4">
                <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-white">{character.name}</h1>
                  <Badge className={`${colorClasses.badge} text-white border-0 shadow-lg`}>
                    {character.role}
                  </Badge>
                </div>
                <p className="text-white/90">{character.personality}</p>
              </div>
            </div>
          </Card>

          {/* Personality Traits */}
          <Card className={`mb-8 bg-slate-800/80 backdrop-blur-sm ${colorClasses.border} shadow-xl ${colorClasses.glow}`}>
            <div className="p-6 md:p-8">
              <h2 className={`${colorClasses.text} mb-6`}>Personality Traits</h2>
              <div className="flex flex-wrap gap-3">
                {character.traits.map((trait, idx) => (
                  <Badge 
                    key={idx}
                    className={`px-4 py-2 ${colorClasses.badge} text-white border-0 shadow-md`}
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Famous Quotes */}
          <Card className={`mb-8 bg-slate-800/80 backdrop-blur-sm ${colorClasses.border} shadow-xl ${colorClasses.glow}`}>
            <div className="p-6 md:p-8">
              <h2 className={`${colorClasses.text} mb-6`}>Famous Quotes</h2>
              <div className="space-y-4">
                {character.quotes.map((quote, idx) => (
                  <div 
                    key={idx}
                    className={`p-6 bg-slate-700/50 rounded-xl ${colorClasses.border} border-2 relative`}
                  >
                    <Quote className={`w-8 h-8 ${colorClasses.text} opacity-30 absolute top-4 left-4`} />
                    <p className={`${colorClasses.text} italic pl-10`}>
                      "{quote}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Role in Story */}
          <Card className={`mb-8 bg-slate-800/80 backdrop-blur-sm ${colorClasses.border} shadow-xl ${colorClasses.glow}`}>
            <div className="p-6 md:p-8">
              <h2 className={`${colorClasses.text} mb-4`}>Role in Story</h2>
              <p className="text-slate-200">
                {character.name} plays a crucial role as the {character.role.toLowerCase()} in Harry Potter's magical journey
                {character.id === '1' && ", facing Lord Voldemort while learning about friendship, bravery, and the power of love at Hogwarts School of Witchcraft and Wizardry."}
                {character.id === '2' && ", using her brilliant mind and magical knowledge to help Harry and Ron solve mysteries and overcome countless obstacles throughout their adventures."}
                {character.id === '3' && ", serving as Hogwarts headmaster and guiding Harry with wisdom and strategic counsel in the fight against dark forces."}
                {character.id === '4' && ", whose complex loyalties and unrequited love ultimately reveal him as one of the bravest characters in the wizarding world."}
                {character.id === '5' && ", offering unique perspectives and unwavering friendship while helping Harry understand the importance of acceptance and imagination."}
                {character.id === '6' && ", balancing strict discipline with fierce loyalty to her students, especially in defending Hogwarts from dark forces."}
              </p>
            </div>
          </Card>

          {/* Start Chat Button */}
          <div className="flex justify-center pb-8">
            <Button 
              onClick={onStartChat}
              className={`px-12 py-6 bg-gradient-to-r ${colorClasses.gradient} hover:opacity-90 text-white shadow-2xl ${colorClasses.glow}`}>
              <MessageCircle className="w-5 h-5 mr-3" />
              Start Chatting with {character.name}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterDetails;
