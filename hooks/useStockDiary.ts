
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { StockEntry } from '../types';

type StockEntryPayload = Omit<StockEntry, 'id' | 'user_id' | 'created_at' | 'entry_date'>;

export const useStockDiary = () => {
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('stock_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (err: any) {
      const message = err.message || 'Failed to fetch entries.';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const insertEntry = async (entry: StockEntryPayload) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from('stock_entries')
      .insert([{ ...entry, user_id: user.id }]);
    
    if (error) throw error;
    await fetchEntries(); // Refetch to update UI
  };
  
  const updateEntry = async (id: string, entry: Partial<StockEntryPayload>) => {
    const { error } = await supabase
      .from('stock_entries')
      .update(entry)
      .eq('id', id);

    if (error) throw error;
    await fetchEntries(); // Refetch to update UI
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase
      .from('stock_entries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    await fetchEntries(); // Refetch to update UI
  };

  return { entries, loading, error, fetchEntries, insertEntry, updateEntry, deleteEntry };
};
