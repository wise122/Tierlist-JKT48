-- Create option_pairs table
CREATE TABLE IF NOT EXISTS option_pairs (
    id BIGSERIAL PRIMARY KEY,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_a_selected INTEGER DEFAULT 0,
    option_b_selected INTEGER DEFAULT 0,
    total_occurrences INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(option_a, option_b)
);

-- Create RLS (Row Level Security) policies
ALTER TABLE option_pairs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads
CREATE POLICY "Allow anonymous read access" 
ON option_pairs FOR SELECT 
TO anon 
USING (true);

-- Allow authenticated updates
CREATE POLICY "Allow authenticated updates" 
ON option_pairs FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Allow authenticated inserts
CREATE POLICY "Allow authenticated inserts" 
ON option_pairs FOR INSERT 
TO authenticated 
WITH CHECK (true); 