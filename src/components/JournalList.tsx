import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit3, X, Save, Calendar, Clock, ChevronRight } from 'lucide-react';

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const JournalList: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/journal');
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (err) {
      console.error('Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSave = async () => {
    if (!currentEntry.title || !currentEntry.content) return;

    const method = currentEntry.id ? 'PUT' : 'POST';
    const url = currentEntry.id ? `/api/journal/${currentEntry.id}` : '/api/journal';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentEntry),
      });

      if (res.ok) {
        setIsEditing(false);
        setCurrentEntry({ title: '', content: '' });
        fetchEntries();
      }
    } catch (err) {
      console.error('Failed to save entry');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const res = await fetch(`/api/journal/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEntries();
      }
    } catch (err) {
      console.error('Failed to delete entry');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    }).format(date);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-stone-900">My Journal</h1>
          <p className="text-stone-500 mt-1">Reflect on your journey.</p>
        </div>
        <button
          onClick={() => {
            setCurrentEntry({ title: '', content: '' });
            setIsEditing(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-stone-800 text-white font-medium rounded-full hover:bg-stone-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>New Entry</span>
        </button>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-serif font-bold text-stone-800">
                {currentEntry.id ? 'Edit Entry' : 'New Reflection'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Title of your reflection..."
              value={currentEntry.title}
              onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
              className="w-full text-xl font-serif font-bold text-stone-900 placeholder-stone-300 border-none focus:ring-0 p-0"
            />
            
            <textarea
              placeholder="What's on your mind today?"
              value={currentEntry.content}
              onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
              className="w-full h-48 text-stone-700 placeholder-stone-300 border-none focus:ring-0 p-0 resize-none leading-relaxed"
            />
            
            <div className="flex justify-end pt-4 border-t border-stone-100">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-3 bg-stone-800 text-white font-medium rounded-full hover:bg-stone-700 transition-all shadow-md"
              >
                <Save className="w-5 h-5" />
                <span>Save Entry</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin mb-4" />
          <p>Gathering your memories...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 bg-stone-100/50 rounded-3xl border-2 border-dashed border-stone-200">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">No entries yet</h3>
          <p className="text-stone-500 mb-6">Your journal is a blank canvas. Start writing today.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-stone-800 text-white font-medium rounded-full hover:bg-stone-700 transition-all"
          >
            Write Your First Entry
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white p-6 rounded-3xl border border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-stone-400 uppercase tracking-wider">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(entry.created_at)}</span>
                    <span className="mx-1">•</span>
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(entry.created_at)}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-stone-700 transition-colors">
                    {entry.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setCurrentEntry(entry);
                      setIsEditing(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-full transition-all"
                    title="Edit entry"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                    title="Delete entry"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-stone-600 leading-relaxed line-clamp-3 whitespace-pre-wrap">
                {entry.content}
              </p>
              <div className="mt-4 pt-4 border-t border-stone-50 flex items-center gap-1 text-sm font-medium text-stone-400 group-hover:text-stone-600 transition-colors">
                <span>Read more</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalList;
