
import React, { useState, useEffect } from 'react';
import { useStockDiary } from '../hooks/useStockDiary';
import { StockEntry } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Label } from './ui/Label';
import { Select } from './ui/Select';
import Spinner from './ui/Spinner';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';

interface EntryFormProps {
  entryToEdit?: StockEntry | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ entryToEdit, onSuccess, onCancel }) => {
  const { insertEntry, updateEntry } = useStockDiary();
  const [formData, setFormData] = useState({
    ticker: '',
    company_name: '',
    price_at_entry: '',
    sentiment: 'Neutral',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (entryToEdit) {
      setFormData({
        ticker: entryToEdit.ticker,
        company_name: entryToEdit.company_name,
        price_at_entry: String(entryToEdit.price_at_entry),
        sentiment: entryToEdit.sentiment,
        content: entryToEdit.content,
      });
    } else {
        setFormData({
            ticker: '',
            company_name: '',
            price_at_entry: '',
            sentiment: 'Neutral',
            content: '',
        });
    }
  }, [entryToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!formData.ticker || !formData.company_name || !formData.price_at_entry || !formData.content) {
      setError('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    try {
        const payload = {
            ticker: formData.ticker.toUpperCase(),
            company_name: formData.company_name,
            price_at_entry: Number(formData.price_at_entry),
            sentiment: formData.sentiment as StockEntry['sentiment'],
            content: formData.content,
        };

        if (entryToEdit) {
            await updateEntry(entryToEdit.id, payload);
        } else {
            await insertEntry(payload);
        }
        onSuccess();
    } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setError(`Failed to save entry: ${message}`);
        console.error(err);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{entryToEdit ? 'Edit' : 'Add'} Stock Entry</DialogTitle>
        <DialogDescription>
          {entryToEdit ? 'Update the details for your stock analysis.' : 'Log a new analysis for a stock in your watchlist.'}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="ticker" className="text-right">Ticker</Label>
          <Input id="ticker" value={formData.ticker} onChange={handleChange} className="col-span-3" placeholder="e.g., AAPL" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="company_name" className="text-right">Company</Label>
          <Input id="company_name" value={formData.company_name} onChange={handleChange} className="col-span-3" placeholder="e.g., Apple Inc." />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price_at_entry" className="text-right">Price</Label>
          <Input id="price_at_entry" type="number" step="0.01" value={formData.price_at_entry} onChange={handleChange} className="col-span-3" placeholder="e.g., 175.50" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="sentiment" className="text-right">Sentiment</Label>
          <Select id="sentiment" value={formData.sentiment} onChange={handleChange} className="col-span-3">
            <option>Bullish</option>
            <option>Neutral</option>
            <option>Bearish</option>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="content" className="text-right pt-2">Content</Label>
          <Textarea id="content" value={formData.content} onChange={handleChange} className="col-span-3" rows={6} placeholder="Your analysis, notes, and thesis..." />
        </div>
      </div>
      
      {error && <p className="text-sm text-destructive mb-4 text-center">{error}</p>}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
          {entryToEdit ? 'Save Changes' : 'Create Entry'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default EntryForm;
