-- Drop existing policies for suggestions table
DROP POLICY IF EXISTS "Only admins can view all suggestions" ON suggestions;
DROP POLICY IF EXISTS "Anyone can submit suggestions" ON suggestions;
DROP POLICY IF EXISTS "Only admins can update suggestions" ON suggestions;
DROP POLICY IF EXISTS "Only admins can delete suggestions" ON suggestions;

-- Drop existing policies for options table
DROP POLICY IF EXISTS "Options are viewable by everyone" ON options;
DROP POLICY IF EXISTS "Only admins can insert options" ON options;
DROP POLICY IF EXISTS "Only admins can update options" ON options;
DROP POLICY IF EXISTS "Only admins can delete options" ON options;

-- Create new policies for suggestions table (anonymous access)
-- Allow anyone to view suggestions
CREATE POLICY "Allow anonymous read access for suggestions" 
ON suggestions FOR SELECT 
TO public 
USING (true);

-- Allow anyone to submit suggestions
CREATE POLICY "Allow anonymous insert for suggestions" 
ON suggestions FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow anyone to update suggestions
CREATE POLICY "Allow anonymous update for suggestions" 
ON suggestions FOR UPDATE 
TO public 
USING (true)
WITH CHECK (true);

-- Allow anyone to delete suggestions
CREATE POLICY "Allow anonymous delete for suggestions" 
ON suggestions FOR DELETE 
TO public 
USING (true);

-- Create new policies for options table (anonymous access)
-- Allow anyone to view options
CREATE POLICY "Allow anonymous read access for options" 
ON options FOR SELECT 
TO public 
USING (true);

-- Allow anyone to insert options
CREATE POLICY "Allow anonymous insert for options" 
ON options FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow anyone to update options
CREATE POLICY "Allow anonymous update for options" 
ON options FOR UPDATE 
TO public 
USING (true)
WITH CHECK (true);

-- Allow anyone to delete options
CREATE POLICY "Allow anonymous delete for options" 
ON options FOR DELETE 
TO public 
USING (true); 