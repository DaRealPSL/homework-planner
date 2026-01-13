-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Classes table
CREATE TABLE classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT code_format CHECK (code ~ '^[0-9]{1,2}[A-Z]{2,3}[0-9]{1,2}$')
);

-- 2. User Profiles (extends Supabase Auth)
-- NOTE: class_id made nullable so automatic profile creation on signup won't fail.
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id),   -- removed NOT NULL
  display_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- 3. Homework Items
CREATE TABLE homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) NOT NULL,
  title text NOT NULL,
  description text,
  subject text,
  due_date timestamptz NOT NULL,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Attachments (links homework to storage)
CREATE TABLE homework_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  homework_id uuid REFERENCES homework(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  filename text NOT NULL,
  mime_type text NOT NULL,
  uploaded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- 5. Per-user completion tracking
CREATE TABLE homework_completion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  homework_id uuid REFERENCES homework(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  done boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(homework_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_homework_class_id ON homework(class_id);
CREATE INDEX idx_homework_due_date ON homework(due_date);
CREATE INDEX idx_homework_attachments_homework_id ON homework_attachments(homework_id);
CREATE INDEX idx_homework_completion_homework_id ON homework_completion(homework_id);
CREATE INDEX idx_homework_completion_user_id ON homework_completion(user_id);
CREATE INDEX idx_profiles_class_id ON profiles(class_id);

-- Enable RLS
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_completion ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Classes: Anyone can read, only admin can write
CREATE POLICY "Anyone can read classes" ON classes
  FOR SELECT USING (true);

-- Profiles: Users can only insert their own profile
CREATE POLICY "Users can create own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Class members can view profiles" ON profiles
  FOR SELECT USING (
    class_id IN (
      SELECT class_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Homework: Class-bound access
CREATE POLICY "Class members can view homework" ON homework
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.class_id = homework.class_id
    )
  );

CREATE POLICY "Class members can create homework" ON homework
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE class_id = homework.class_id
    )
  );

CREATE POLICY "Creators can update homework" ON homework
  FOR UPDATE USING (
    created_by = auth.uid()
  );

CREATE POLICY "Creators can delete homework" ON homework
  FOR DELETE USING (
    created_by = auth.uid()
  );

-- Attachments: Class-bound access
CREATE POLICY "Class members can view attachments" ON homework_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM homework 
      WHERE homework.id = homework_attachments.homework_id
      AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.class_id = homework.class_id
      )
    )
  );

CREATE POLICY "Class members can create attachments" ON homework_attachments
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE class_id IN (
        SELECT class_id FROM homework 
        WHERE homework.id = homework_attachments.homework_id
      )
    )
  );

CREATE POLICY "Uploader can delete attachments" ON homework_attachments
  FOR DELETE USING (auth.uid() = uploaded_by);

-- Homework Completion: Users can manage their own completion
CREATE POLICY "Users can view completion" ON homework_completion
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM homework 
      WHERE homework.id = homework_completion.homework_id
      AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.class_id = homework.class_id
      )
    )
  );

CREATE POLICY "Users can manage own completion" ON homework_completion
  FOR ALL USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_homework_updated_at BEFORE UPDATE ON homework
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homework_completion_updated_at BEFORE UPDATE ON homework_completion
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to create profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql' security definer;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Enable realtime for collaboration tables
-- Make sure the publication 'supabase_realtime' exists in your DB; if not, create it or use the correct name.
ALTER PUBLICATION supabase_realtime ADD TABLE homework;
ALTER PUBLICATION supabase_realtime ADD TABLE homework_attachments;
ALTER PUBLICATION supabase_realtime ADD TABLE homework_completion;

-- Insert sample classes
INSERT INTO classes (code, name) VALUES 
('3HT1', 'Grade 3 HAVO Tweetalig Class 1');
