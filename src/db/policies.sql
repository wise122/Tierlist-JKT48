-- Enable Row Level Security (RLS) for all tables
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE option_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Options table policies
-- Anyone can read options
CREATE POLICY "Options are viewable by everyone" 
ON options FOR SELECT 
TO public 
USING (true);

-- Only authenticated users with specific role can insert/update/delete
CREATE POLICY "Only admins can insert options" 
ON options FOR INSERT 
TO authenticated 
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update options" 
ON options FOR UPDATE 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete options" 
ON options FOR DELETE 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin');

-- Option pairs table policies
-- Anyone can read option pairs (for viewing results)
CREATE POLICY "Option pairs are viewable by everyone" 
ON option_pairs FOR SELECT 
TO public 
USING (true);

-- Anyone can insert/update option pairs (for recording game results)
CREATE POLICY "Anyone can record game results" 
ON option_pairs FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Anyone can update game results" 
ON option_pairs FOR UPDATE 
TO public 
USING (true)
WITH CHECK (true);

-- Only admins can delete option pairs
CREATE POLICY "Only admins can delete option pairs" 
ON option_pairs FOR DELETE 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin');

-- Suggestions table policies
-- Only admins can view all suggestions
CREATE POLICY "Only admins can view all suggestions" 
ON suggestions FOR SELECT 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin');

-- Anyone can submit suggestions
CREATE POLICY "Anyone can submit suggestions" 
ON suggestions FOR INSERT 
TO public 
WITH CHECK (true);

-- Only admins can update suggestions (e.g., change status)
CREATE POLICY "Only admins can update suggestions" 
ON suggestions FOR UPDATE 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Only admins can delete suggestions
CREATE POLICY "Only admins can delete suggestions" 
ON suggestions FOR DELETE 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin');

-- Create admin role function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get current user id
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS TEXT AS $$
BEGIN
  RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 