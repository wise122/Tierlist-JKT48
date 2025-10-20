-- Drop existing tables if they exist
DROP TABLE IF EXISTS option_pairs CASCADE;
DROP TABLE IF EXISTS options CASCADE;

-- Create options table
CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create option_pairs table for tracking comparisons
CREATE TABLE option_pairs (
    id SERIAL PRIMARY KEY,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_a_selected INTEGER DEFAULT 0,
    option_b_selected INTEGER DEFAULT 0,
    total_occurrences INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(option_a, option_b)
);

-- Insert initial JKT48 fan experience options
INSERT INTO options (name) VALUES
    ('Verif Theater terus tapi Row J'),
  ('Verif 2 bulan sekali tapi Row A terus'),
  ('Dapat MnG tapi lupa mau ngomong apa'),
  ('Dapat video call tapi koneksi lag'),
  ('Dapat handshake tapi keringat dingin'),
  ('Dapat 2s tapi mata kedip'),
  ('Dapat tiket theater tapi macet total'),
  ('Dapat verif tapi lupa bawa KTP'),
  ('Dapat 2-shot tapi baju ketumpahan minuman'),
  ('Dapat theater tapi Kursi B1'),
  ('Dapat verif tapi salah tulis nama'),
  ('Dapat tiket konser tapi sakit'),
  ('Dapat 2-shot tapi pose awkward'),
  ('Dapat theater tapi ketiduran dirumah'),
  ('Dapat meet & greet tapi telat'),
  ('Dapat foto bareng tapi blur'),
  ('Verif terus tapi uang pas-pasan'),;

-- Create index for faster lookups
CREATE INDEX idx_options_name ON options(name);
CREATE INDEX idx_option_pairs_options ON option_pairs(option_a, option_b); 