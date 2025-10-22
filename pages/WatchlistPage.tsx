
import React, { useState, useMemo } from 'react';
import { useStockDiary } from '../hooks/useStockDiary';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { Dialog, DialogContent } from '../components/ui/Dialog';
import EntryForm from '../components/EntryForm';
import { StockEntry } from '../types';
import { PlusCircle, Trash2, Edit } from 'lucide-react';

const StockDiaryPage: React.FC = () => {
  const { entries, loading, error, deleteEntry } = useStockDiary();
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<StockEntry | null>(null);

  const watchlist = useMemo(() => {
    const uniqueEntries = new Map<string, { company_name: string }>();
    entries.forEach(entry => {
      if (!uniqueEntries.has(entry.ticker)) {
        uniqueEntries.set(entry.ticker, { company_name: entry.company_name });
      }
    });
    return Array.from(uniqueEntries.entries()).map(([ticker, { company_name }]) => ({ ticker, company_name }));
  }, [entries]);

  const selectedEntries = useMemo(() => {
    if (!selectedTicker) return [];
    return entries.filter(e => e.ticker === selectedTicker).sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime());
  }, [entries, selectedTicker]);
  
  const handleAddNew = () => {
    setEntryToEdit(null);
    setIsFormOpen(true);
  };
  
  const handleEdit = (entry: StockEntry) => {
    setEntryToEdit(entry);
    setIsFormOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this entry?')) {
        await deleteEntry(id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-8 w-8" />
        <p className="ml-4 text-lg">Loading your stock diary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-destructive rounded-lg">
        <h3 className="text-xl font-semibold text-destructive">Failed to Load Data</h3>
        <p className="text-muted-foreground mt-2">
          Could not fetch your diary entries. Please check your network connection or Supabase Row Level Security (RLS) policies.
        </p>
        <p className="text-xs text-muted-foreground mt-4 p-2 bg-secondary rounded-md">
          <strong>Error details:</strong> {error}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* Watchlist Column */}
      <div className="md:col-span-1 lg:col-span-1">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Watchlist</h2>
            <Button size="sm" onClick={handleAddNew}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Entry
            </Button>
        </div>
        <div className="space-y-2">
            {watchlist.length === 0 && <p className="text-muted-foreground">No stocks added yet.</p>}
            {watchlist.map(({ ticker, company_name }) => (
                <Card 
                    key={ticker} 
                    className={`cursor-pointer transition-all ${selectedTicker === ticker ? 'border-primary shadow-lg' : 'hover:border-primary/50'}`}
                    onClick={() => setSelectedTicker(ticker)}
                >
                    <CardContent className="p-4">
                        <p className="font-bold text-lg">{ticker}</p>
                        <p className="text-sm text-muted-foreground">{company_name}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
      
      {/* Entries Column */}
      <div className="md:col-span-2 lg:col-span-3">
         <h2 className="text-2xl font-bold mb-4">
            {selectedTicker ? `Entries for ${selectedTicker}` : 'Select a stock to view entries'}
        </h2>
        {selectedTicker ? (
            selectedEntries.length > 0 ? (
                <div className="space-y-4">
                    {selectedEntries.map(entry => (
                        <Card key={entry.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>${entry.price_at_entry} - {entry.sentiment}</CardTitle>
                                        <CardDescription>{new Date(entry.entry_date).toLocaleDateString()}</CardDescription>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="whitespace-pre-wrap">
                                <p>{entry.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground mt-8 text-center">No entries found for {selectedTicker}.</p>
            )
        ) : (
             <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold">Select a stock</h3>
                <p className="text-muted-foreground mt-2">Choose a stock from your watchlist to see your notes.</p>
            </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <EntryForm 
            entryToEdit={entryToEdit} 
            onSuccess={() => setIsFormOpen(false)} 
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockDiaryPage;
