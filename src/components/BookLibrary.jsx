import { Book, Calendar, Users, Sparkles } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback.jsx';

export function BookLibrary({ books, onBookSelect }) {
  if (!books || books.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-12">
      <div className="mb-6 flex items-center gap-3">
        <Book className="w-6 h-6 text-purple-300" />
        <h2 className="text-white">Your Library</h2>
        <Badge className="bg-purple-500/20 text-purple-200 border-purple-500/30">
          {books.length} {books.length === 1 ? 'book' : 'books'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <Card
            key={book.id}
            onClick={() => onBookSelect(book)}
            className="group bg-slate-800/80 backdrop-blur-sm border-purple-500/30 shadow-lg shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden"
          >
            <div className="relative h-48 overflow-hidden">
              <ImageWithFallback
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute top-3 right-3">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-slate-300">{book.author}</p>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-purple-200">
                <Users className="w-4 h-4" />
                <span className="text-purple-200">
                  {book.characterCount} characters
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(book.uploadDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="pt-2">
                <div className="text-purple-300 group-hover:text-purple-200 transition-colors flex items-center gap-2">
                  <span>View Characters</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default BookLibrary;
