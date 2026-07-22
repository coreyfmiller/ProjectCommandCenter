const SUPABASE_URL = 'https://qpbhvbubudlohgkvlmiv.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwYmh2YnVidWRsb2hna3ZsbWl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU3OTU1MiwiZXhwIjoyMDkyMTU1NTUyfQ.PvKrZvrcqTcqzzMC25i3Wy_6NIH7veQLqCSOWURSEvY';

// Try to query the table - if it fails, the user needs to create it manually
const checkResp = await fetch(`${SUPABASE_URL}/rest/v1/command_center_state?select=id&limit=1`, {
  headers: {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
  },
});

if (checkResp.ok) {
  console.log('✓ Table "command_center_state" already exists!');
  process.exit(0);
}

console.log('✗ Table "command_center_state" does not exist.');
console.log('');
console.log('Please run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard):');
console.log('');
console.log(`-- COMMAND CENTER STATE TABLE
-- NOTE: This table belongs to the Command Center dashboard, NOT MarketMojo.
-- If selling MarketMojo, migrate this table to a separate project first.

CREATE TABLE IF NOT EXISTS command_center_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data_key TEXT NOT NULL,
  data_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, data_key)
);

ALTER TABLE command_center_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own state" ON command_center_state
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

COMMENT ON TABLE command_center_state IS 'Command Center dashboard state - separate from MarketMojo. Migrate before selling.';
`);
