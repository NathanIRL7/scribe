--Tabelle für Schreibstil
CREATE TABLE IF NOT EXISTS schreibstil (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stil TEXT,
  beschreibung TEXT,
  signatur TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE schreibstil ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "schreibstil_policy" ON schreibstil;
CREATE POLICY "schreibstil_policy" ON schreibstil FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid()=user_id);

-- Tabelle für User Profil 
CREATE TABLE IF NOT EXISTS user_profil (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT,
  firma TEXT,
  rolle TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE user_profil ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_profil_policy" ON user_profil;
CREATE POLICY "user_profil_policy" ON user_profil FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

--Tabelle für Kontakte
CREATE TABLE IF NOT EXISTS kontakte (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  firma TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE kontakte ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "kontakte_policy" ON kontakte;
CREATE POLICY "kontakte_policy" ON kontakte FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

--Tabelle für generierte Emails
CREATE TABLE IF NOT EXISTS generierte_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  empfaenger TEXT,
  firma TEXT,
  thema TEXT,
  email_text TEXT,
  typ TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE generierte_emails ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "generierte_emails_policy" ON generierte_emails;
CREATE POLICY "generierte_emails_policy" ON generierte_emails FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

--Tabelle für Templates
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  inhalt TEXT,
  typ TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "templates_policy" ON templates;
CREATE POLICY "templates_policy" ON templates FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_kontakte_user_id ON kontakte(user_id);
CREATE INDEX IF NOT EXISTS idx_generierte_emails_user_id ON generierte_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_generierte_emails_created ON generierte_emails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
