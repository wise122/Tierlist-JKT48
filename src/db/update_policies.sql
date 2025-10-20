-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous read access" ON option_pairs;
DROP POLICY IF EXISTS "Allow authenticated updates" ON option_pairs;
DROP POLICY IF EXISTS "Allow authenticated inserts" ON option_pairs;

-- Create new policies for anonymous access
CREATE POLICY "Allow anonymous read access" 
ON option_pairs FOR SELECT 
TO anon 
USING (true);

CREATE POLICY "Allow anonymous updates" 
ON option_pairs FOR UPDATE 
TO anon 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" 
ON option_pairs FOR INSERT 
TO anon 
WITH CHECK (true); 