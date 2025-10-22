
export interface StockEntry {
  id: string;
  user_id: string;
  ticker: string;
  company_name: string;
  entry_date: string;
  content: string;
  price_at_entry: number;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  created_at: string;
}
